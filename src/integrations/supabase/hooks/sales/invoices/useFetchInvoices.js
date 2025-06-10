import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching customer invoices data
 */
export const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('Fetching customer invoices from Supabase...');
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customer invoices:', error);
        setError(error.message);
        toast({
          title: "Error fetching invoices",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Customer invoices fetched successfully:', data);
      setInvoices(data || []);
    } catch (err) {
      console.error('Unexpected error fetching customer invoices:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    loading,
    error,
    fetchInvoices
  };
};
