
import { useState } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for creating sales orders
 */
export const useCreateSalesOrder = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const createSalesOrder = async (orderData) => {
    try {
      setLoading(true);
      console.log('Creating new sales order with data:', orderData);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .insert([orderData])
        .select();
      
      if (error) {
        console.error('Error creating sales order:', error);
        setError(error.message);
        toast({
          title: "Error creating sales order",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Sales order created successfully:', data);
      toast({
        title: "Success",
        description: "Sales order created successfully",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating sales order:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    createSalesOrder,
    loading,
    error
  };
};
