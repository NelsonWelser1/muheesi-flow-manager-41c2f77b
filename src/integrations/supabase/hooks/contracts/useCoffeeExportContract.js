
import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { fromSupabase } from '../../utils/supabaseUtils';
import { showContractSavedToast, showContractErrorToast, showSuccessToast, showErrorToast } from '@/components/ui/notifications';
import { useToast } from '@/components/ui/use-toast';
import { calculateTotalContractValue, generateContractNumber } from '@/components/inventory/kajon/export-business/contracts/utils/productManagement';

export const useCoffeeExportContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all coffee export contracts
  const fetchContracts = async () => {
    console.info('Fetching coffee export contracts from Supabase...');
    try {
      const data = await fromSupabase(
        supabase
          .from('coffee_export_contracts')
          .select('*')
          .order('created_at', { ascending: false })
      );
      console.info(`Fetched ${data.length} coffee export contracts successfully`);
      return data;
    } catch (error) {
      console.error('Error fetching coffee export contracts:', error);
      showErrorToast(toast, `Failed to fetch contracts: ${error.message}`);
      throw error;
    }
  };

  // Fetch a single coffee export contract by ID
  const fetchContractById = async (id) => {
    if (!id) return null;
    
    try {
      const data = await fromSupabase(
        supabase
          .from('coffee_export_contracts')
          .select('*')
          .eq('id', id)
          .single()
      );
      return data;
    } catch (error) {
      console.error(`Error fetching contract with ID ${id}:`, error);
      showErrorToast(toast, `Failed to fetch contract: ${error.message}`);
      throw error;
    }
  };

  // Save a coffee export contract (create or update)
  const saveContract = async (contractData) => {
    setIsLoading(true);
    try {
      console.log('Saving contract data:', contractData);
      
      // Calculate total contract value from products
      const totalValue = calculateTotalContractValue(contractData.products || []);
      
      // Generate a contract number if not provided
      const contractNumber = contractData.contract_number || generateContractNumber();
      
      // Ensure all JSONB fields are properly formatted as arrays
      const products = Array.isArray(contractData.products) ? contractData.products : [];
      const quality_specifications = Array.isArray(contractData.quality_specifications) 
        ? contractData.quality_specifications 
        : [];
      const payment_terms_items = Array.isArray(contractData.payment_terms_items) 
        ? contractData.payment_terms_items 
        : [];
      
      // Create the contract data object to save
      const dataToSave = {
        ...contractData,
        contract_number: contractNumber,
        total_contract_value: totalValue,
        products: products,
        quality_specifications: quality_specifications,
        payment_terms_items: payment_terms_items,
        certifications: contractData.certifications || null
      };

      console.log('Prepared contract data for saving:', dataToSave);

      // Determine if this is an update or insert
      let result;
      if (contractData.id) {
        console.log(`Updating existing contract with ID: ${contractData.id}`);
        result = await supabase
          .from('coffee_export_contracts')
          .update(dataToSave)
          .eq('id', contractData.id)
          .select();
      } else {
        console.log('Creating new contract');
        result = await supabase
          .from('coffee_export_contracts')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error when saving contract:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase after save operation');
      }

      console.log('Contract saved successfully:', data[0]);
      
      // Show success notification
      showContractSavedToast(toast, contractData.buyer_name || 'Client');
      
      return data[0];
    } catch (error) {
      console.error('Error saving coffee export contract:', error);
      showContractErrorToast(toast, 'Save Error', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a coffee export contract
  const deleteContract = async (id) => {
    setIsLoading(true);
    try {
      // Get the contract data before deleting (for showing the notification)
      const contractData = await fetchContractById(id);
      
      const { error } = await supabase
        .from('coffee_export_contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showSuccessToast(
        toast, 
        `Contract ${contractData.contract_number} for ${contractData.buyer_name} has been deleted.`
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting coffee export contract:', error);
      showErrorToast(toast, `Failed to delete contract: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Query for fetching all contracts
  const contractsQuery = useQuery({
    queryKey: ['coffee_export_contracts'],
    queryFn: fetchContracts
  });

  // Mutation for saving a contract
  const saveMutation = useMutation({
    mutationFn: saveContract,
    onSuccess: () => {
      // Invalidate and refetch contracts list after a successful save
      queryClient.invalidateQueries({
        queryKey: ['coffee_export_contracts']
      });
    }
  });

  // Mutation for deleting a contract
  const deleteMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      // Invalidate and refetch contracts list after a successful delete
      queryClient.invalidateQueries({
        queryKey: ['coffee_export_contracts']
      });
    }
  });

  return {
    contracts: contractsQuery.data || [],
    isLoading: isLoading || contractsQuery.isLoading || saveMutation.isPending || deleteMutation.isPending,
    isError: contractsQuery.isError,
    error: contractsQuery.error,
    saveContract: saveMutation.mutate,
    deleteContract: deleteMutation.mutate,
    fetchContractById
  };
};
