
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for creating customer invoices
 */
export const useCreateInvoice = (refreshCallback) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const createInvoice = async (invoiceData) => {
    try {
      setLoading(true);
      console.log('Creating new customer invoice with data:', invoiceData);
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .insert([invoiceData])
        .select();
      
      if (error) {
        console.error('Error creating customer invoice:', error);
        setError(error.message);
        toast({
          title: "Error creating invoice",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Customer invoice created successfully:', data);
      
      // Call the refresh callback if provided
      if (typeof refreshCallback === 'function') {
        await refreshCallback();
      }
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating customer invoice:', err);
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
    createInvoice,
    loading,
    error
  };
};
