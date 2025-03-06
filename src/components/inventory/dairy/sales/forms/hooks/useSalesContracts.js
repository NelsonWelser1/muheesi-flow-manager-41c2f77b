
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useSalesContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all contracts
  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching contracts from Supabase...');
      const { data, error } = await supabase
        .from('sales_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched contracts:', data);
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to fetch contracts: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new contract
  const createContract = async (contractData) => {
    try {
      console.log('Creating new contract with data:', contractData);
      
      // Format data for Supabase if needed
      const formattedData = {
        ...contractData,
        products: JSON.stringify(contractData.products),
        total_value: parseFloat(contractData.total_value) || 0
      };
      
      console.log('Formatted contract data for Supabase:', formattedData);
      
      const { data, error } = await supabase
        .from('sales_contracts')
        .insert([formattedData])
        .select();

      if (error) throw error;
      
      console.log('Contract created successfully:', data);
      toast({
        title: 'Success',
        description: 'Sales contract created successfully',
      });
      
      // Update the local state with the new contract
      setContracts(prevContracts => [data[0], ...prevContracts]);
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: 'Error',
        description: `Failed to create contract: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Get a contract by ID
  const getContractById = async (contractId) => {
    try {
      console.log('Fetching contract by ID:', contractId);
      const { data, error } = await supabase
        .from('sales_contracts')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (error) throw error;
      
      console.log('Contract details:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching contract:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a contract
  const updateContract = async (contractId, updates) => {
    try {
      console.log('Updating contract:', contractId, 'with data:', updates);
      
      // Format data for Supabase if needed
      const formattedUpdates = {
        ...updates,
        products: updates.products ? JSON.stringify(updates.products) : undefined,
        total_value: updates.total_value ? parseFloat(updates.total_value) : undefined
      };
      
      const { data, error } = await supabase
        .from('sales_contracts')
        .update(formattedUpdates)
        .eq('contract_id', contractId)
        .select();

      if (error) throw error;
      
      console.log('Contract updated successfully:', data);
      toast({
        title: 'Success',
        description: 'Sales contract updated successfully',
      });
      
      // Update the local state with the updated contract
      setContracts(prevContracts => 
        prevContracts.map(contract => 
          contract.contract_id === contractId ? data[0] : contract
        )
      );
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating contract:', error);
      toast({
        title: 'Error',
        description: `Failed to update contract: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Delete a contract
  const deleteContract = async (contractId) => {
    try {
      console.log('Deleting contract:', contractId);
      const { error } = await supabase
        .from('sales_contracts')
        .delete()
        .eq('contract_id', contractId);

      if (error) throw error;
      
      console.log('Contract deleted successfully');
      toast({
        title: 'Success',
        description: 'Sales contract deleted successfully',
      });
      
      // Update the local state by removing the deleted contract
      setContracts(prevContracts => 
        prevContracts.filter(contract => contract.contract_id !== contractId)
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: 'Error',
        description: `Failed to delete contract: ${error.message}`,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  // Load contracts when component mounts
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    isLoading,
    error,
    fetchContracts,
    createContract,
    getContractById,
    updateContract,
    deleteContract
  };
};
