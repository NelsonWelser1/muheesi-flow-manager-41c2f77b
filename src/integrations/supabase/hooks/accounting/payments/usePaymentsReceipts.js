
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { fetchPaymentsReceipts } from './api/fetchPayments';
import { createPayment } from './api/createPayment';
import { updatePayment } from './api/updatePayment';
import { deletePayment } from './api/deletePayment';
import { generatePaymentNumber } from './utils/paymentNumberGenerator';

/**
 * Hook for managing payments and receipts
 * @returns {Object} - Payments and receipts operations
 */
export const usePaymentsReceipts = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  const fetchPayments = async (filters = {}) => {
    try {
      setIsLoading(true);
      
      const data = await fetchPaymentsReceipts(filters);
      setPayments(data);
      return data;
    } catch (err) {
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
  
  const handleCreatePayment = async (data) => {
    try {
      setIsLoading(true);
      
      const result = await createPayment(data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `${data.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`,
        });
        
        // Refresh the payments list
        await fetchPayments();
      } else if (result.error) {
        throw result.error;
      }
      
      return result;
    } catch (err) {
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
  
  const handleUpdatePayment = async (id, data) => {
    try {
      setIsLoading(true);
      
      const result = await updatePayment(id, data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Record updated successfully",
        });
        
        // Refresh the payments list
        await fetchPayments();
      } else if (result.error) {
        throw result.error;
      }
      
      return result;
    } catch (err) {
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
  
  const handleDeletePayment = async (id) => {
    try {
      setIsLoading(true);
      
      const result = await deletePayment(id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Record deleted successfully",
        });
        
        // Refresh the payments list
        await fetchPayments();
      } else if (result.error) {
        throw result.error;
      }
      
      return result;
    } catch (err) {
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
  
  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);
  
  return {
    payments,
    isLoading,
    error,
    fetchPaymentsReceipts: fetchPayments,
    generatePaymentNumber,
    createPayment: handleCreatePayment,
    deletePayment: handleDeletePayment,
    updatePayment: handleUpdatePayment
  };
};
