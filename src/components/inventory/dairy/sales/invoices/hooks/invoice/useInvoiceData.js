
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useInvoiceData = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch invoices from Supabase
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching invoices from Supabase...');
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        showErrorToast(toast, `Failed to fetch invoices: ${error.message}`);
        return;
      }
      
      console.log('Invoices fetched successfully:', data);
      setInvoices(data || []);
    } catch (err) {
      console.error('Unexpected error fetching invoices:', err);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit invoice to Supabase
  const submitInvoice = async (invoiceData) => {
    try {
      console.log("Invoice data to be saved to Supabase:", invoiceData);
      
      // Save to Supabase
      const { data: savedInvoice, error } = await supabase
        .from('customer_invoices')
        .insert([invoiceData])
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log("Invoice saved successfully:", savedInvoice);
      
      showSuccessToast(toast, "Invoice created successfully");
      return true;
    } catch (error) {
      console.error("Error creating invoice:", error);
      showErrorToast(toast, `Failed to create invoice: ${error.message}`);
      return false;
    }
  };

  return {
    invoices,
    isLoading,
    fetchInvoices,
    submitInvoice
  };
};
