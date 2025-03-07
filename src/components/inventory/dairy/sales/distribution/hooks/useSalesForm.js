
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAutoFill } from '@/contexts/AutoFillContext';
import { parseCurrency } from '../utils/formatters';

export const useSalesForm = (fetchBatchEntries) => {
  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm();
  const { toast } = useToast();
  const [batchSelected, setBatchSelected] = useState(false);
  const [currency, setCurrency] = useState('UGX');
  const { updateAutoFillData } = useAutoFill();

  // Form values
  const quantity = watch('quantity');
  const pricePerUnit = watch('price_per_unit');
  const formData = watch();

  const handleBatchSelect = (entryId) => {
    console.log("Selected entry ID:", entryId);
    const selectedEntry = watch().batchEntries?.find(entry => entry.id === entryId) || 
                         window.batchEntries?.find(entry => entry.id === entryId);
    
    if (selectedEntry) {
      console.log("Auto-filling with batch data:", selectedEntry);
      
      // Set form values from selected entry
      setValue('batch_id', selectedEntry.batch_id);
      setValue('product_type', selectedEntry.product_type);
      setValue('quantity', selectedEntry.unit_quantity);
      setValue('unit_weight', selectedEntry.unit_weight);
      
      // Mark that a batch has been selected to make fields read-only
      setBatchSelected(true);
      
      // If price_per_unit is already set, calculate total_price
      const currentPricePerUnit = getValues('price_per_unit');
      if (currentPricePerUnit) {
        const numericPrice = parseCurrency(currentPricePerUnit);
        const totalPrice = Number(selectedEntry.unit_quantity) * Number(numericPrice);
        setValue('total_price', formatCurrency(totalPrice, currency));
      }
      
      updateAutoFillData('selectedBatch', selectedEntry);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit sales records",
          variant: "destructive",
        });
        return;
      }

      // Parse currency values to numbers before saving
      const dataToSubmit = {
        ...data,
        price_per_unit: parseFloat(parseCurrency(data.price_per_unit)),
        total_price: parseFloat(parseCurrency(data.total_price)),
        batch_id: data.batch_id,
        created_by: user.id,
        date_time: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('sales_records')
        .insert([dataToSubmit]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales record saved successfully",
      });
      
      // Refresh batch options after submission to reflect the newly used batch
      fetchBatchEntries();
      
      // Reset form and batch selection state
      reset();
      setBatchSelected(false);
    } catch (error) {
      console.error('Error saving sales record:', error);
      toast({
        title: "Error",
        description: "Failed to save sales record",
        variant: "destructive",
      });
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formData,
    quantity,
    pricePerUnit,
    currency,
    setCurrency,
    batchSelected,
    handleBatchSelect,
    handleFormSubmit
  };
};
