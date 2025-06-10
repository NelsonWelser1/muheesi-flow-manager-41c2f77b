
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching sales orders data
 */
export const useFetchSalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all sales orders
  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching sales orders from Supabase...');
      
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching sales orders:', error);
        setError(error.message);
        toast({
          title: "Error fetching sales orders",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Sales orders fetched successfully:', data);
      setSalesOrders(data || []);
    } catch (err) {
      console.error('Unexpected error fetching sales orders:', err);
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

  // Fetch sales orders on component mount
  useEffect(() => {
    fetchSalesOrders();
  }, []);

  return {
    salesOrders,
    loading,
    error,
    fetchSalesOrders
  };
};
