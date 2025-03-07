
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useToast } from '@/components/ui/use-toast';

export const useSalesOrders = () => {
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

  // Create a new sales order
  const createSalesOrder = async (orderData) => {
    try {
      console.log('Creating new sales order with data:', orderData);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .insert([orderData])
        .select();
      
      if (error) {
        console.error('Error creating sales order:', error);
        toast({
          title: "Error creating sales order",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Sales order created successfully:', data);
      toast({
        title: "Success",
        description: "Sales order created successfully",
      });
      
      // Refresh the list
      fetchSalesOrders();
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating sales order:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Get a single sales order by ID
  const getSalesOrderById = async (id) => {
    try {
      console.log(`Fetching sales order with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching sales order with ID ${id}:`, error);
        return { success: false, error };
      }
      
      console.log('Sales order fetched successfully:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error fetching sales order:', err);
      return { success: false, error: err };
    }
  };

  // Update a sales order
  const updateSalesOrder = async (id, updates) => {
    try {
      console.log(`Updating sales order with ID: ${id}`, updates);
      
      const { data, error } = await supabase
        .from('sales_orders')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating sales order with ID ${id}:`, error);
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
      
      // Refresh the list
      fetchSalesOrders();
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating sales order:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Delete a sales order
  const deleteSalesOrder = async (id) => {
    try {
      console.log(`Deleting sales order with ID: ${id}`);
      
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting sales order with ID ${id}:`, error);
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
      
      // Refresh the list
      fetchSalesOrders();
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting sales order:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
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
    fetchSalesOrders,
    createSalesOrder,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder
  };
};
