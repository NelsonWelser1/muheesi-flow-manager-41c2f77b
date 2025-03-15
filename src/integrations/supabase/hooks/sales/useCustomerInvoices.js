
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing customer invoices
 */
export const useCustomerInvoices = () => {
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

  // Create new invoice
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
      await fetchInvoices(); // Refresh the invoices list
      
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

  // Update invoice
  const updateInvoice = async (id, updates) => {
    try {
      setLoading(true);
      console.log(`Updating customer invoice ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating customer invoice:', error);
        setError(error.message);
        toast({
          title: "Error updating invoice",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Customer invoice updated successfully:', data);
      await fetchInvoices(); // Refresh the invoices list
      
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating customer invoice:', err);
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

  // Delete invoice
  const deleteInvoice = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting customer invoice ${id}`);
      
      const { error } = await supabase
        .from('customer_invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting customer invoice:', error);
        setError(error.message);
        toast({
          title: "Error deleting invoice",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Customer invoice deleted successfully');
      await fetchInvoices(); // Refresh the invoices list
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting customer invoice:', err);
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

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
};
