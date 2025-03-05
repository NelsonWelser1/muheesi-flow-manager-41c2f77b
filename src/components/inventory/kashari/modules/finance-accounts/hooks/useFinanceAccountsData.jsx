
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

// Define schema for form validation
const formSchema = z.object({
  transaction_date: z.date(),
  transaction_type: z.string().min(1, { message: "Transaction type is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  description: z.string().optional(),
  reference_number: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().default("Completed"),
  tags: z.array(z.string()).optional(),
});

export const useFinanceAccountsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_date: new Date(),
      transaction_type: '',
      category: '',
      amount: '',
      description: '',
      reference_number: '',
      payment_method: '',
      status: 'Completed',
      tags: [],
    },
  });

  // Fetch finance accounts records from Supabase
  const fetchTransactions = async () => {
    console.log('Fetching finance accounts records...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('finance_accounts')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating finance_accounts table...');
        const { error: createError } = await supabase.rpc('create_finance_accounts_table');
        if (createError) throw createError;
        console.log('Finance accounts table created successfully');
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('finance_accounts')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      console.log('Finance accounts records fetched:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching finance accounts records:', error);
      toast.error('Failed to load finance accounts data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('Submitting finance accounts data:', data);
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = {
        transaction_date: data.transaction_date,
        transaction_type: data.transaction_type,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description || null,
        reference_number: data.reference_number || null,
        payment_method: data.payment_method || null,
        status: data.status,
        tags: data.tags || [],
      };

      if (editingTransaction) {
        // Update existing record
        const { error } = await supabase
          .from('finance_accounts')
          .update(submissionData)
          .eq('id', editingTransaction.id);
        
        if (error) throw error;
        toast.success('Finance transaction updated successfully');
        setEditingTransaction(null);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('finance_accounts')
          .insert([submissionData]);
        
        if (error) throw error;
        toast.success('Finance transaction added successfully');
      }
      
      // Reset form
      form.reset({
        transaction_date: new Date(),
        transaction_type: '',
        category: '',
        amount: '',
        description: '',
        reference_number: '',
        payment_method: '',
        status: 'Completed',
        tags: [],
      });
      
      // Refresh data
      fetchTransactions();
    } catch (error) {
      console.error('Error saving finance transaction:', error);
      toast.error('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit operation
  const handleEdit = (transaction) => {
    console.log('Editing transaction:', transaction);
    setEditingTransaction(transaction);
    
    form.reset({
      transaction_date: new Date(transaction.transaction_date),
      transaction_type: transaction.transaction_type,
      category: transaction.category,
      amount: String(transaction.amount),
      description: transaction.description || '',
      reference_number: transaction.reference_number || '',
      payment_method: transaction.payment_method || '',
      status: transaction.status,
      tags: transaction.tags || [],
    });
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const { error } = await supabase
          .from('finance_accounts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
      }
    }
  };

  // Debug function to log current form state
  const debugForm = () => {
    const formValues = form.getValues();
    console.log('Current form state:', formValues);
    return formValues;
  };

  // Calculate summary statistics
  const getFinanceSummary = () => {
    const income = transactions
      .filter(t => t.transaction_type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.transaction_type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    
    const categoryTotals = {};
    transactions.forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      if (t.transaction_type === 'Income') {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] -= t.amount;
      }
    });
    
    return {
      income,
      expense,
      balance,
      categoryTotals
    };
  };

  return {
    transactions,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchTransactions,
    debugForm,
    editingTransaction,
    setEditingTransaction,
    getFinanceSummary
  };
};
