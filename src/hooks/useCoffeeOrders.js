import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export const useCoffeeOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coffee_orders')
        .select(`
          *,
          coffee_customers (
            id,
            name,
            type,
            country
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    try {
      // Generate order number
      const year = new Date().getFullYear();
      const { count } = await supabase
        .from('coffee_orders')
        .select('*', { count: 'exact', head: true });
      
      const orderNumber = `ORD-${year}-${String((count || 0) + 1).padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('coffee_orders')
        .insert([{ 
          ...orderData,
          order_number: orderNumber,
          order_date: format(new Date(), 'yyyy-MM-dd'),
          status: orderData.status || 'pending',
          fulfillment: 'Unfulfilled',
          payment_status: 'Pending'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Order created successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error adding order:', err);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('coffee_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => prev.map(order => order.id === id ? data : order));
      toast({
        title: "Success",
        description: "Order updated successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteOrder = async (id) => {
    try {
      const { error } = await supabase
        .from('coffee_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setOrders(prev => prev.filter(order => order.id !== id));
      toast({
        title: "Success",
        description: "Order deleted successfully"
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting order:', err);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      fulfilled: orders.filter(o => o.fulfillment === 'Fulfilled').length,
      unfulfilled: orders.filter(o => o.fulfillment === 'Unfulfilled').length,
      totalValue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderStats
  };
};
