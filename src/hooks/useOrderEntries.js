
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useOrderEntries = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching order entries from Supabase...');
      
      const { data, error } = await supabase
        .from('logistics_order_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching order entries:', error);
        setError(error.message);
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Order entries fetched successfully:', data);
      setOrders(data || []);
    } catch (err) {
      console.error('Unexpected error fetching orders:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new order
  const addOrder = async (orderData) => {
    try {
      setIsLoading(true);
      console.log('Adding new order entry:', orderData);
      
      // Ensure order_details is a string if it's an object
      if (typeof orderData.order_details === 'object') {
        orderData.order_details = JSON.stringify(orderData.order_details);
      }
      
      const { data, error } = await supabase
        .from('logistics_order_entries')
        .insert([{
          ...orderData,
          // Setting operator_id to null since authentication is temporarily disabled
          operator_id: null
        }])
        .select();
      
      if (error) {
        console.error('Error adding order entry:', error);
        setError(error.message);
        toast({
          title: "Error adding order",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Order entry added successfully:', data);
      
      // Update the local state with the new order
      setOrders(prevOrders => [data[0], ...prevOrders]);
      
      toast({
        title: "Success",
        description: "Order added successfully",
      });
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Unexpected error adding order:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    addOrder
  };
};
