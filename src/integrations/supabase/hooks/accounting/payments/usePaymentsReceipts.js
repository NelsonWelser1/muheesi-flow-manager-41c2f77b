
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

export const usePaymentsReceipts = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  const fetchPaymentsReceipts = async (filters = {}) => {
    try {
      setIsLoading(true);
      console.log('Fetching payments & receipts with filters:', filters);
      
      let query = supabase
        .from('payments_receipts')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.paymentType) {
        query = query.eq('payment_type', filters.paymentType);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate && filters.endDate) {
        query = query
          .gte('payment_date', filters.startDate)
          .lte('payment_date', filters.endDate);
      }
      
      if (filters.search) {
        query = query.or(`party_name.ilike.%${filters.search}%,payment_number.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      console.log('Fetched payments & receipts:', data);
      setPayments(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching payments/receipts:', err);
      setError(err.message);
      toast({
        title: "Error fetching records",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a unique payment number based on type
  const generatePaymentNumber = (type) => {
    const prefix = type === 'received' ? 'RCP' : 'PMT';
    const date = format(new Date(), 'yyyyMMdd');
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `${prefix}-${date}-${random}`;
  };
  
  // Create a new payment record
  const createPayment = async (data) => {
    try {
      setIsLoading(true);
      console.log('Creating payment/receipt with data:', data);
      
      const { error } = await supabase
        .from('payments_receipts')
        .insert([{
          payment_number: data.paymentNumber,
          payment_type: data.paymentType,
          party_name: data.partyName,
          payment_date: data.paymentDate,
          amount: parseFloat(data.amount),
          currency: data.currency,
          payment_method: data.paymentMethod,
          reference_number: data.referenceNumber,
          status: data.status,
          notes: data.notes
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${data.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`,
      });
      
      // Refresh the payments list
      await fetchPaymentsReceipts();
      
      return { success: true };
    } catch (err) {
      console.error('Error creating payment/receipt:', err);
      setError(err.message);
      toast({
        title: "Error creating record",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a payment record
  const deletePayment = async (id) => {
    try {
      setIsLoading(true);
      console.log('Deleting payment/receipt with ID:', id);
      
      const { error } = await supabase
        .from('payments_receipts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
      
      // Refresh the payments list
      await fetchPaymentsReceipts();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting payment/receipt:', err);
      setError(err.message);
      toast({
        title: "Error deleting record",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a payment record
  const updatePayment = async (id, data) => {
    try {
      setIsLoading(true);
      console.log('Updating payment/receipt with ID:', id, 'Data:', data);
      
      const { error } = await supabase
        .from('payments_receipts')
        .update({
          payment_type: data.paymentType,
          party_name: data.partyName,
          payment_date: data.paymentDate,
          amount: parseFloat(data.amount),
          currency: data.currency,
          payment_method: data.paymentMethod,
          reference_number: data.referenceNumber,
          status: data.status,
          notes: data.notes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
      
      // Refresh the payments list
      await fetchPaymentsReceipts();
      
      return { success: true };
    } catch (err) {
      console.error('Error updating payment/receipt:', err);
      setError(err.message);
      toast({
        title: "Error updating record",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch payments on component mount
  useEffect(() => {
    fetchPaymentsReceipts();
  }, []);
  
  return {
    payments,
    isLoading,
    error,
    fetchPaymentsReceipts,
    generatePaymentNumber,
    createPayment,
    deletePayment,
    updatePayment
  };
};
