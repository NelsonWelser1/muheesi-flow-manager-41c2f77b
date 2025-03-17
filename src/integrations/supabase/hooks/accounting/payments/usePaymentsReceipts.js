
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { useState, useEffect } from "react";

export const usePaymentsReceipts = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments_receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message);
      toast({
        title: "Error fetching payments",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments_receipts')
        .insert([paymentData])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${paymentData.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`,
      });
      
      await fetchPayments();
      return { success: true, data };
    } catch (err) {
      console.error("Error creating payment:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const generatePaymentNumber = (paymentType) => {
    const prefix = paymentType === 'received' ? "RCPT" : "PMT";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
    generatePaymentNumber
  };
};
