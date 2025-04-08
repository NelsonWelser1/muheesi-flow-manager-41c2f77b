
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useLocalPurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Generate a order number with format LPO-YYYY-XXXX
  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `LPO-${year}-${randomId}`;
  };

  // Fetch all purchase orders
  const fetchOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if table exists
      const { data: tableExists, error: checkError } = await supabase
        .from('local_purchase_agreements')
        .select('id')
        .limit(1)
        .single();
      
      if (checkError && checkError.code === '42P01') {
        console.log('Table does not exist yet, creating dummy data');
        setOrders([]);
        return { success: true, data: [] };
      }
      
      let query = supabase
        .from('local_purchase_agreements')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.status) {
        query = query.eq('contract_status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`buyer_name.ilike.%${filters.search}%,supplier_name.ilike.%${filters.search}%,contract_number.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrders(data || []);
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(err);
      
      // Don't show error toast for table not existing
      if (err.code !== '42P01') {
        toast({
          title: "Error",
          description: `Failed to fetch purchase orders: ${err.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get a single order by ID
  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching purchase order:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to fetch purchase order: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save a new purchase order
  const saveOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!orderData.supplier_name) {
        throw new Error("Supplier name is required");
      }
      
      // Generate contract number if not provided
      if (!orderData.contract_number) {
        orderData.contract_number = generateOrderNumber();
      }
      
      // Ensure agreement_date is valid
      if (!orderData.agreement_date) {
        orderData.agreement_date = new Date().toISOString().split('T')[0];
      }
      
      // Calculate total value from items
      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.total_value = orderData.items.reduce(
          (total, item) => total + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 
          0
        );
      } else {
        orderData.total_value = 0;
        orderData.items = [];
      }
      
      // Set default status if not provided
      if (!orderData.contract_status) {
        orderData.contract_status = 'draft';
      }
      
      // Insert into database
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .insert(orderData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Purchase Order #${data.contract_number} saved successfully`,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error saving purchase order:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to save purchase order: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update an existing order
  const updateOrder = useCallback(async (id, orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!orderData.supplier_name) {
        throw new Error("Supplier name is required");
      }
      
      // Calculate total value from items
      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.total_value = orderData.items.reduce(
          (total, item) => total + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 
          0
        );
      }
      
      // Update in database
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .update(orderData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Purchase Order #${data.contract_number} updated successfully`,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating purchase order:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to update purchase order: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete an order
  const deleteOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get order first to reference in success message
      const { data: order } = await supabase
        .from('local_purchase_agreements')
        .select('contract_number')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('local_purchase_agreements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Purchase Order ${order?.contract_number || id} deleted successfully`,
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting purchase order:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to delete purchase order: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderById,
    saveOrder,
    updateOrder,
    deleteOrder,
    generateOrderNumber
  };
};
