
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useFinanceAccountsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      transaction_type: '',
      category: '',
      amount: '',
      description: '',
      reference_number: '',
      payment_method: '',
      status: 'Completed',
      tags: []
    }
  });

  // Fetch finance accounts transactions from Supabase
  const fetchTransactions = async () => {
    console.log('Fetching finance accounts transactions...');
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Finance accounts transactions fetched:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching finance accounts transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load finance accounts data",
        variant: "destructive"
      });
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
    console.log('Submitting finance transaction data:', data);
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = {
        transaction_type: data.transaction_type,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description || null,
        reference_number: data.reference_number || null,
        payment_method: data.payment_method || null,
        status: data.status,
        tags: data.tags || []
      };

      // Insert new transaction
      const { error } = await supabase
        .from('finance_accounts')
        .insert([submissionData]);
      
      if (error) throw error;
      toast({
        title: "Success",
        description: "Finance transaction added successfully"
      });
      
      // Reset form
      form.reset();
      
      // Refresh data
      fetchTransactions();
    } catch (error) {
      console.error('Error saving finance transaction:', error);
      toast({
        title: "Error",
        description: "Failed to save transaction: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log current form state
  const debugForm = () => {
    const formValues = form.getValues();
    console.log('Current form state:', formValues);
    return formValues;
  };

  return {
    transactions,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    fetchTransactions,
    debugForm
  };
};
