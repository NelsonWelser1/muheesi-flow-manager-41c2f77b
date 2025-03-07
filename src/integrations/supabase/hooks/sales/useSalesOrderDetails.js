
import { useState } from 'react';
import { supabase } from '../../supabase';

/**
 * Hook for getting single sales order details
 */
export const useSalesOrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSalesOrderById = async (id) => {
    try {
      setLoading(true);
      console.log(`Fetching sales order with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching sales order with ID ${id}:`, error);
        setError(error.message);
        return { success: false, error };
      }
      
      console.log('Sales order fetched successfully:', data);
      setOrder(data);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error fetching sales order:', err);
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    getSalesOrderById
  };
};
