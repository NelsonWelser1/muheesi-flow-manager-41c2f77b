
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for creating bill/expense records
 */
export const useCreateBillExpense = (refreshCallback) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const createBillExpense = async (billExpenseData) => {
    try {
      setLoading(true);
      console.log('Creating bill/expense:', billExpenseData);
      
      // Map form fields to database columns
      const mappedData = {
        bill_number: billExpenseData.billNumber,
        bill_date: billExpenseData.billDate,
        due_date: billExpenseData.dueDate,
        supplier_name: billExpenseData.supplierName,
        expense_type: billExpenseData.expenseType,
        expense_details: billExpenseData.expenseDetails,
        amount: parseFloat(billExpenseData.amount),
        currency: billExpenseData.currency,
        payment_method: billExpenseData.paymentMethod,
        status: billExpenseData.status,
        notes: billExpenseData.notes,
        is_recurring: billExpenseData.isRecurring,
        recurring_frequency: billExpenseData.recurringFrequency,
        recurring_end_date: billExpenseData.recurringEndDate,
        receipt_url: billExpenseData.receiptUrl
      };
      
      const { data, error } = await supabase
        .from('bills_expenses')
        .insert(mappedData)
        .select();
      
      if (error) {
        console.error('Error creating bill/expense:', error);
        setError(error.message);
        toast({
          title: "Error saving bill/expense",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Bill/expense created successfully:', data);
      
      // Call the refresh callback if provided to update the list
      if (typeof refreshCallback === 'function') {
        await refreshCallback();
      }
      
      toast({
        title: "Success",
        description: "Bill/expense recorded successfully",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating bill/expense:', err);
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

  return {
    createBillExpense,
    loading,
    error
  };
};
