
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing bills and expenses in Supabase
 */
export const useBillsExpenses = () => {
  const [billsExpenses, setBillsExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all bills and expenses
  const fetchBillsExpenses = async () => {
    try {
      setLoading(true);
      console.log('Fetching bills and expenses from Supabase...');
      
      const { data, error } = await supabase
        .from('bills_expenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bills and expenses:', error);
        setError(error.message);
        toast({
          title: "Error fetching bills and expenses",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Bills and expenses fetched successfully:', data);
      setBillsExpenses(data || []);
    } catch (err) {
      console.error('Unexpected error fetching bills and expenses:', err);
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

  // Create a new bill/expense
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
      await fetchBillsExpenses();
      
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

  // Upload receipt file
  const uploadReceipt = async (file, billNumber) => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${billNumber}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading receipt:', filePath);
      
      const { data, error } = await supabase.storage
        .from('expenses')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading receipt:', error);
        toast({
          title: "Error uploading receipt",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('expenses')
        .getPublicUrl(filePath);
      
      console.log('Receipt uploaded successfully:', publicUrl);
      
      toast({
        title: "Success",
        description: "Receipt uploaded successfully",
      });
      
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('Unexpected error uploading receipt:', err);
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

  // Get latest bill number
  const getLatestBillNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('bills_expenses')
        .select('bill_number')
        .order('bill_number', { ascending: true })
        .limit(1);
      
      if (error) {
        console.error('Error getting latest bill number:', error);
        return generateBillNumber();
      }
      
      if (data && data.length > 0) {
        const lastBillNumber = data[0].bill_number;
        const prefix = "BILL";
        const lastNumber = parseInt(lastBillNumber.split('-')[1], 10);
        const newNumber = lastNumber + 1;
        const timestamp = new Date().getTime().toString().slice(-4);
        return `${prefix}-${newNumber.toString().padStart(5, '0')}-${timestamp}`;
      } else {
        return generateBillNumber(10000); // Start from 10000 if no bills exist
      }
    } catch (err) {
      console.error('Error in getLatestBillNumber:', err);
      return generateBillNumber();
    }
  };

  const generateBillNumber = (startNum = 10000) => {
    const prefix = "BILL";
    const randomNum = startNum + Math.floor(Math.random() * 1000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum.toString().padStart(5, '0')}-${timestamp}`;
  };

  useEffect(() => {
    fetchBillsExpenses();
  }, []);

  return {
    billsExpenses,
    loading,
    error,
    fetchBillsExpenses,
    createBillExpense,
    uploadReceipt,
    getLatestBillNumber
  };
};
