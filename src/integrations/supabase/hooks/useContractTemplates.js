
import { useCallback, useState } from 'react';
import { supabase } from '../supabase';
import { useToast } from "@/components/ui/use-toast";
import { 
  showSuccessToast, 
  showErrorToast, 
  showLoadingToast, 
  dismissToast 
} from "@/components/ui/notifications";
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing export contract templates
 */
export const useContractTemplates = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Save a contract template to Supabase
   * @param {Object} contractData - The contract data to save
   * @returns {Promise<Object>} - The saved contract data
   */
  const saveContract = useCallback(async (contractData) => {
    const loadingToastId = showLoadingToast(toast, "Saving contract...");
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate contract ID if not provided
      const contractId = contractData.id || uuidv4();
      
      // Format contract data for storage
      const formattedContractData = {
        id: contractId,
        contract_name: contractData.title || `${contractData.type} Contract - ${new Date().toLocaleDateString()}`,
        contract_type: contractData.type, // coffee, general, fresh
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        contract_number: contractData.contractNumber,
        contract_date: contractData.currentDate,
        
        // Seller and buyer details
        seller_details: contractData.sellerDetails || {},
        buyer_details: contractData.buyerDetails || {},
        
        // Products as JSONB array
        products: contractData.products || [],
        
        // Payment terms as JSONB array
        payment_terms: contractData.paymentTermsItems || [],
        
        // Shipping terms
        shipping_terms: {
          incoterm: contractData.shippingLeftValue1,
          packaging: contractData.shippingLeftValue2,
          loading_port: contractData.shippingLeftValue3,
          destination: contractData.shippingRightValue1,
          latest_shipment_date: contractData.shippingRightValue2,
          delivery_timeline: contractData.shippingRightValue3,
          additional_terms: contractData.additionalShippingTerms
        },
        
        // Signature fields
        signatures: {
          seller_name: contractData.sellerName,
          seller_title: contractData.sellerTitle,
          seller_date: contractData.sellerDate,
          seller_signature: contractData.sellerSignature,
          buyer_name: contractData.buyerSignatureName,
          buyer_title: contractData.buyerSignatureTitle,
          buyer_date: contractData.buyerSignatureDate,
          buyer_signature: contractData.buyerSignature
        },
        
        // Store the entire contract data as a JSONB backup
        // This ensures we can always reconstruct the contract exactly as it was saved
        contract_data: contractData,
        
        // Status for filtering
        status: 'active'
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('export_contracts')
        .upsert(formattedContractData, { onConflict: 'id', returning: 'minimal' });

      if (error) throw error;
      
      dismissToast(loadingToastId);
      showSuccessToast(toast, "Contract saved successfully");
      
      return { success: true, id: contractId };
    } catch (err) {
      console.error("Error saving contract:", err);
      setError(err.message);
      dismissToast(loadingToastId);
      showErrorToast(toast, `Failed to save contract: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Fetch saved contracts with optional filtering
   * @param {Object} filters - Optional filters for contracts
   * @returns {Promise<Array>} - List of contracts
   */
  const fetchContracts = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('export_contracts')
        .select('*');
      
      // Apply filters if provided
      if (filters.type) {
        query = query.eq('contract_type', filters.type);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Sort by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err.message);
      showErrorToast(toast, `Failed to fetch contracts: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Fetch a specific contract by ID
   * @param {string} id - Contract ID
   * @returns {Promise<Object>} - Contract data
   */
  const fetchContractById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('export_contracts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Return the complete contract data for reconstruction
      return data.contract_data || data;
    } catch (err) {
      console.error("Error fetching contract:", err);
      setError(err.message);
      showErrorToast(toast, `Failed to fetch contract: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Delete a contract by ID
   * @param {string} id - Contract ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteContract = useCallback(async (id) => {
    const loadingToastId = showLoadingToast(toast, "Deleting contract...");
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('export_contracts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      dismissToast(loadingToastId);
      showSuccessToast(toast, "Contract deleted successfully");
      return true;
    } catch (err) {
      console.error("Error deleting contract:", err);
      setError(err.message);
      dismissToast(loadingToastId);
      showErrorToast(toast, `Failed to delete contract: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    saveContract,
    fetchContracts,
    fetchContractById,
    deleteContract,
    isLoading,
    error
  };
};
