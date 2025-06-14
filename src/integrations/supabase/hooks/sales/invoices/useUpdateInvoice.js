
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for updating customer invoices
 */
export const useUpdateInvoice = (refreshCallback) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const updateInvoice = async (id, updates) => {
    try {
      setLoading(true);
      console.log(`Updating customer invoice ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating customer invoice:', error);
        setError(error.message);
        toast({
          title: "Error updating invoice",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Customer invoice updated successfully:', data);
      
      // Call the refresh callback if provided
      if (typeof refreshCallback === 'function') {
        await refreshCallback();
      }
      
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating customer invoice:', err);
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
    updateInvoice,
    loading,
    error
  };
};
