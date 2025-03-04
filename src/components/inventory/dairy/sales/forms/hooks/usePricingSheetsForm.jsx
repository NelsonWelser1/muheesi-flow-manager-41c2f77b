
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const usePricingSheetsForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([{ 
    name: '', 
    category: '', 
    base_price: '', 
    discount: '0', 
    final_price: '0' 
  }]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      effective_date: '',
      expiry_date: '',
      status: 'draft'
    }
  });

  const handleDebug = () => {
    const formData = form.getValues();
    console.log('Current form values:', formData);
    console.log('Products:', products);
  };

  const onSubmit = async (data) => {
    if (products.some(product => !product.name || !product.base_price)) {
      showErrorToast(toast, "Please fill in all required product fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a sheet ID
      const sheetId = `PS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user data:', userData);
      
      // Format data for Supabase
      const formattedData = {
        sheet_id: sheetId,
        title: data.title,
        description: data.description,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date || null,
        products: products,
        status: data.status,
        created_by: userData?.user?.id || null
      };

      console.log('Submitting pricing sheet data:', formattedData);

      const { data: insertData, error } = await supabase
        .from('pricing_sheets')
        .insert([formattedData])
        .select();

      if (error) {
        console.error('Error creating pricing sheet:', error);
        throw error;
      }

      console.log('Pricing sheet created successfully:', insertData);
      showSuccessToast(toast, "Pricing sheet created successfully");

      // Reset form
      form.reset({
        title: '',
        description: '',
        effective_date: '',
        expiry_date: '',
        status: 'draft'
      });
      setProducts([{ 
        name: '', 
        category: '', 
        base_price: '', 
        discount: '0', 
        final_price: '0' 
      }]);
    } catch (error) {
      console.error('Error creating pricing sheet:', error);
      showErrorToast(toast, "Failed to create pricing sheet: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    products,
    setProducts,
    isSubmitting,
    handleDebug,
    onSubmit
  };
};
