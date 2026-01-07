import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useDairyCustomers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dairy_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dairy customers:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load dairy customers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const { data, error } = await supabase
        .from('dairy_customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Customer added successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error adding dairy customer:', err);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('dairy_customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCustomers(prev => prev.map(cust => cust.id === id ? data : cust));
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      return { success: true, data };
    } catch (err) {
      console.error('Error updating dairy customer:', err);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const { error } = await supabase
        .from('dairy_customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCustomers(prev => prev.filter(cust => cust.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting dairy customer:', err);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getCustomerStats = () => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'Active').length,
      inactive: customers.filter(c => c.status === 'Inactive').length,
      byType: {
        wholesale: customers.filter(c => c.type === 'Wholesale').length,
        retail: customers.filter(c => c.type === 'Retail').length,
        distribution: customers.filter(c => c.type === 'Distribution').length
      }
    };
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerStats
  };
};
