
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  // Fetch all transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setIsFetching(true);
      console.log("Fetching transactions from Supabase...");
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        toast({
          variant: "destructive",
          title: "Error fetching transactions",
          description: error.message || "Failed to load transactions",
        });
        return;
      }

      console.log("Transactions fetched successfully:", data);
      setTransactions(data || []);
    } catch (err) {
      console.error("Unexpected error fetching transactions:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while fetching transactions",
      });
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Save a new transaction
  const saveTransaction = useCallback(async (formData) => {
    try {
      setIsLoading(true);
      console.log("Saving transaction to Supabase:", formData);

      // Validate required fields
      const requiredFields = ["date", "bankAccount", "type", "payee", "reason", "amount"];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return false;
      }

      // Validate amount is a number and positive
      if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid Amount",
          description: "Please enter a valid positive amount",
        });
        return false;
      }

      // Format data for database
      const transactionData = {
        date: formData.date,
        bank_account: formData.bankAccount,
        type: formData.type,
        payee: formData.payee,
        reason: formData.reason,
        amount: Number(formData.amount),
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from("transactions")
        .insert(transactionData)
        .select();

      if (error) {
        console.error("Error saving transaction:", error);
        toast({
          variant: "destructive",
          title: "Error saving transaction",
          description: error.message || "Failed to save transaction",
        });
        return false;
      }

      console.log("Transaction saved successfully:", data);
      
      // Update local state
      setTransactions(prev => [...data, ...prev]);
      
      toast({
        title: "Transaction Added",
        description: "The transaction was successfully recorded",
      });

      return true;
    } catch (err) {
      console.error("Unexpected error saving transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving the transaction",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update an existing transaction
  const updateTransaction = useCallback(async (id, formData) => {
    try {
      setIsLoading(true);
      console.log("Updating transaction in Supabase:", id, formData);

      // Format data for database
      const transactionData = {
        date: formData.date,
        bank_account: formData.bankAccount,
        type: formData.type,
        payee: formData.payee,
        reason: formData.reason,
        amount: Number(formData.amount),
        updated_at: new Date(),
      };

      const { data, error } = await supabase
        .from("transactions")
        .update(transactionData)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating transaction:", error);
        toast({
          variant: "destructive",
          title: "Error updating transaction",
          description: error.message || "Failed to update transaction",
        });
        return false;
      }

      console.log("Transaction updated successfully:", data);
      
      // Update local state
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? data[0] : transaction
        )
      );
      
      toast({
        title: "Transaction Updated",
        description: "The transaction was successfully updated",
      });

      return true;
    } catch (err) {
      console.error("Unexpected error updating transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating the transaction",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete a transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      setIsLoading(true);
      console.log("Deleting transaction from Supabase:", id);

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting transaction:", error);
        toast({
          variant: "destructive",
          title: "Error deleting transaction",
          description: error.message || "Failed to delete transaction",
        });
        return false;
      }

      console.log("Transaction deleted successfully");
      
      // Update local state
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      toast({
        title: "Transaction Deleted",
        description: "The transaction was successfully deleted",
      });

      return true;
    } catch (err) {
      console.error("Unexpected error deleting transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while deleting the transaction",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    transactions,
    isLoading,
    isFetching,
    fetchTransactions,
    saveTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
