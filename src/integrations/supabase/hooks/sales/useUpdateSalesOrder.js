
import { useState } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for updating sales orders
 */
export const useUpdateSalesOrder = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const updateSalesOrder = async (id, updates) => {
    try {
      setLoading(true);
      console.log(`Updating sales order with ID: ${id}`, updates);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating sales order with ID ${id}:`, error);
        setError(error.message);
        toast({
          title: "Error updating sales order",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Sales order updated successfully:', data);
      toast({
        title: "Success",
        description: "Sales order updated successfully",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating sales order:', err);
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
    updateSalesOrder,
    loading,
    error
  };
};
