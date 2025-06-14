
import { useState } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for deleting sales orders
 */
export const useDeleteSalesOrder = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const deleteSalesOrder = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting sales order with ID: ${id}`);
      
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting sales order with ID ${id}:`, error);
        setError(error.message);
        toast({
          title: "Error deleting sales order",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Sales order deleted successfully');
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting sales order:', err);
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
    deleteSalesOrder,
    loading,
    error
  };
};
