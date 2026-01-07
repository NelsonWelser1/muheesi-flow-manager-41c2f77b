import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('customer_invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message);
      toast({
        title: "Error fetching invoices",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createInvoice = async (invoiceData) => {
    try {
      // Generate invoice ID if not provided
      const invoiceId = invoiceData.id || `INV-${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error: insertError } = await supabase
        .from('customer_invoices')
        .insert([{
          ...invoiceData,
          id: invoiceId,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: "Invoice Created",
        description: `Invoice ${invoiceId} has been created successfully.`
      });
      
      await fetchInvoices();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast({
        title: "Error creating invoice",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateInvoice = async (id, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('customer_invoices')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (updateError) throw updateError;
      
      toast({
        title: "Invoice Updated",
        description: "Invoice has been updated successfully."
      });
      
      await fetchInvoices();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating invoice:', err);
      toast({
        title: "Error updating invoice",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('customer_invoices')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been deleted successfully."
      });
      
      await fetchInvoices();
      return { success: true };
    } catch (err) {
      console.error('Error deleting invoice:', err);
      toast({
        title: "Error deleting invoice",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const getInvoiceStats = useCallback(() => {
    const total = invoices.length;
    const paid = invoices.filter(i => i.payment_status === 'paid').length;
    const pending = invoices.filter(i => i.payment_status === 'pending').length;
    const overdue = invoices.filter(i => {
      if (i.payment_status === 'paid') return false;
      return new Date(i.due_date) < new Date();
    }).length;
    const totalValue = invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
    
    return { total, paid, pending, overdue, totalValue };
  }, [invoices]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceStats
  };
};
