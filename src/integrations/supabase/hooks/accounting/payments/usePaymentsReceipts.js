
import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for fetching and managing payments and receipts
 */
export const usePaymentsReceipts = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all payments and receipts
  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('Fetching payments and receipts from Supabase...');
      
      const { data, error } = await supabase
        .from('payments_receipts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments and receipts:', error);
        setError(error.message);
        toast({
          title: "Error fetching payments and receipts",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Payments and receipts fetched successfully:', data);
      
      // Map the database column names to the frontend property names
      const mappedData = data.map(item => ({
        id: item.id,
        paymentNumber: item.payment_number,
        paymentType: item.payment_type,
        partyName: item.party_name,
        paymentDate: item.payment_date,
        amount: item.amount,
        currency: item.currency,
        paymentMethod: item.payment_method,
        referenceNumber: item.reference_number,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setPayments(mappedData || []);
    } catch (err) {
      console.error('Unexpected error fetching payments and receipts:', err);
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

  // Create new payment/receipt
  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      console.log('Creating new payment/receipt in Supabase:', paymentData);
      
      // Convert frontend property names to database column names
      const dbData = {
        payment_number: paymentData.paymentNumber,
        payment_type: paymentData.paymentType,
        party_name: paymentData.partyName,
        payment_date: paymentData.paymentDate,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        reference_number: paymentData.referenceNumber,
        status: paymentData.status,
        notes: paymentData.notes
      };
      
      const { data, error } = await supabase
        .from('payments_receipts')
        .insert([dbData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating payment/receipt:', error);
        toast({
          title: "Error creating payment/receipt",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      console.log('Payment/receipt created successfully:', data);
      
      // Map the response back to frontend property names
      const mappedData = {
        id: data.id,
        paymentNumber: data.payment_number,
        paymentType: data.payment_type,
        partyName: data.party_name,
        paymentDate: data.payment_date,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        referenceNumber: data.reference_number,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setPayments(prevPayments => [mappedData, ...prevPayments]);
      return mappedData;
    } catch (err) {
      console.error('Unexpected error creating payment/receipt:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing payment/receipt
  const updatePayment = async (id, paymentData) => {
    try {
      setLoading(true);
      console.log(`Updating payment/receipt ${id} in Supabase:`, paymentData);
      
      // Convert frontend property names to database column names
      const dbData = {
        payment_number: paymentData.paymentNumber,
        payment_type: paymentData.paymentType,
        party_name: paymentData.partyName,
        payment_date: paymentData.paymentDate,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        reference_number: paymentData.referenceNumber,
        status: paymentData.status,
        notes: paymentData.notes
      };
      
      const { data, error } = await supabase
        .from('payments_receipts')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating payment/receipt:', error);
        toast({
          title: "Error updating payment/receipt",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      console.log('Payment/receipt updated successfully:', data);
      
      // Map the response back to frontend property names
      const mappedData = {
        id: data.id,
        paymentNumber: data.payment_number,
        paymentType: data.payment_type,
        partyName: data.party_name,
        paymentDate: data.payment_date,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        referenceNumber: data.reference_number,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setPayments(prevPayments => 
        prevPayments.map(payment => payment.id === id ? mappedData : payment)
      );
      return mappedData;
    } catch (err) {
      console.error('Unexpected error updating payment/receipt:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete payment/receipt
  const deletePayment = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting payment/receipt ${id} from Supabase`);
      
      const { error } = await supabase
        .from('payments_receipts')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting payment/receipt:', error);
        toast({
          title: "Error deleting payment/receipt",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      console.log('Payment/receipt deleted successfully');
      setPayments(prevPayments => 
        prevPayments.filter(payment => payment.id !== id)
      );
      return true;
    } catch (err) {
      console.error('Unexpected error deleting payment/receipt:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
  };
};
