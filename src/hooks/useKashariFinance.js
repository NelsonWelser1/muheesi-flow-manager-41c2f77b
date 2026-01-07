import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useKashariFinance = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('kashari_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching Kashari transactions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const { data, error } = await supabase
        .from('kashari_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction recorded successfully');
      return data;
    } catch (err) {
      console.error('Error creating transaction:', err);
      toast.error('Failed to record transaction');
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('kashari_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Transaction updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast.error('Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('kashari_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction');
      throw err;
    }
  };

  const getFinancialSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactions.length
    };
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary
  };
};
