
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useSalesProposalForm = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [products, setProducts] = useState([{ 
    name: '', 
    category: '', 
    base_price: '', 
    discount: '0', 
    final_price: '0' 
  }]);

  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      proposal_date: new Date().toISOString().split('T')[0],
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
      grand_total: '0'
    }
  });

  // Fetch existing sales proposals from Supabase
  const fetchProposals = async () => {
    console.log('Fetching sales proposals...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('sales_proposals')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.log('Table does not exist yet. Please run the migration script.');
        setProposals([]);
        return;
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('sales_proposals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Sales proposals fetched:', data);
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching sales proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load sales proposals data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchProposals();
  }, []);

  // Calculate grand total based on products
  const updateGrandTotal = () => {
    const total = products.reduce((sum, product) => {
      return sum + (parseFloat(product.final_price) || 0);
    }, 0);
    
    form.setValue('grand_total', total.toFixed(2));
  };

  // Update grand total whenever products change
  useEffect(() => {
    updateGrandTotal();
  }, [products]);

  // Handle product changes
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    // Calculate final price when base_price or discount changes
    if (field === 'base_price' || field === 'discount') {
      const basePrice = parseFloat(newProducts[index].base_price) || 0;
      const discount = parseFloat(newProducts[index].discount) || 0;
      
      // Ensure discount is treated as a percentage (0-100)
      const finalPrice = basePrice * (1 - discount / 100);
      
      // Set the final price with 2 decimal places
      newProducts[index].final_price = finalPrice.toFixed(2);
    }
    
    setProducts(newProducts);
  };

  // Add a new product
  const addProduct = () => {
    setProducts([...products, { 
      name: '', 
      category: '', 
      base_price: '', 
      discount: '0', 
      final_price: '0' 
    }]);
  };

  // Remove a product
  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('Form data to submit:', { formData: data, products });
    
    // Validate products
    if (products.some(product => !product.name || !product.base_price)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required product fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a unique proposal ID
      const proposalId = `PRO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Get current user (will be null if no auth)
      const { data: userData } = await supabase.auth.getUser();
      
      // Prepare data for submission
      const formattedData = {
        proposal_id: proposalId,
        customer_name: data.customer_name,
        customer_email: data.customer_email || null,
        customer_phone: data.customer_phone || null,
        proposal_date: data.proposal_date,
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        products: products,
        grand_total: parseFloat(data.grand_total),
        status: 'draft',
        created_by: userData?.user?.id || null
      };

      console.log('Submitting to Supabase:', formattedData);

      // Insert into Supabase
      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      console.log('Sales proposal created successfully');
      toast({
        title: "Success",
        description: "Sales proposal created successfully"
      });

      // Reset form and fetch updated data
      form.reset({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        proposal_date: new Date().toISOString().split('T')[0],
        validity_period: '30',
        terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
        grand_total: '0'
      });
      setProducts([{ 
        name: '', 
        category: '', 
        base_price: '', 
        discount: '0', 
        final_price: '0' 
      }]);
      
      // Refresh proposals list
      fetchProposals();
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create sales proposal: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('Current form values:', form.getValues());
    console.log('Current products:', products);
    return { form: form.getValues(), products };
  };

  return {
    proposals,
    isLoading,
    isSubmitting,
    form,
    products,
    setProducts,
    handleProductChange,
    addProduct,
    removeProduct,
    onSubmit,
    fetchProposals,
    debugState,
    updateGrandTotal
  };
};

export default useSalesProposalForm;
