import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching all bills and expenses
 */
export const useFetchBillsExpenses = () => {
  const [billsExpenses, setBillsExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all bills and expenses
  const fetchBillsExpenses = async () => {
    try {
      setLoading(true);
      console.log('Fetching bills and expenses from Supabase...');
      
      const { data, error } = await supabase
        .from('bills_expenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bills and expenses:', error);
        setError(error.message);
        toast({
          title: "Error fetching bills and expenses",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Bills and expenses fetched successfully:', data);
      setBillsExpenses(data || []);
    } catch (err) {
      console.error('Unexpected error fetching bills and expenses:', err);
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

  useEffect(() => {
    fetchBillsExpenses();
  }, []);

  return {
    billsExpenses,
    loading,
    error,
    fetchBillsExpenses
  };
};
