
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for deleting customer invoices
 */
export const useDeleteInvoice = (refreshCallback) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const deleteInvoice = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting customer invoice ${id}`);
      
      const { error } = await supabase
        .from('customer_invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting customer invoice:', error);
        setError(error.message);
        toast({
          title: "Error deleting invoice",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Customer invoice deleted successfully');
      
      // Call the refresh callback if provided
      if (typeof refreshCallback === 'function') {
        await refreshCallback();
      }
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting customer invoice:', err);
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
    deleteInvoice,
    loading,
    error
  };
};
