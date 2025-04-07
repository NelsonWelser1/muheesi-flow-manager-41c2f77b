
import { useState } from 'react';
import { supabase } from '../supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { fromSupabase } from '../utils/supabaseUtils';

/**
 * Hook for managing contract templates
 */
export const useContractTemplates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Save a completed contract
   * @param {string} templateType - Type of contract (coffee, general, fresh)
   * @param {object} contractData - Contract data including buyer info, products, etc.
   */
  const saveContract = async (templateType, contractData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format the contract name using buyer company name
      const contractName = `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Contract - ${contractData.buyerName || 'Unnamed'}`;
      
      // Create a properly structured contract object for database
      const contract = {
        name: contractName,
        type: templateType,
        status: 'active',
        contract_date: contractData.currentDate || new Date().toISOString().split('T')[0],
        contract_number: contractData.contractNumber,
        buyer_name: contractData.buyerName,
        buyer_address: contractData.buyerAddress,
        buyer_registration: contractData.buyerRegistration,
        // Store structured data for product details and quality specs
        product_details: contractData.productDetails || [],
        quality_specifications: contractData.qualitySpecifications || [],
        // Additional contract fields
        payment_terms: contractData.paymentTerms,
        delivery_terms: contractData.deliveryTerms,
        shipping_terms: contractData.shippingTerms,
        inspection_terms: contractData.inspectionTerms,
        additional_terms: contractData.additionalTerms,
        seller_signature: contractData.sellerSignature,
        buyer_signature: contractData.buyerSignature,
        created_at: new Date().toISOString()
      };
      
      // Save the contract to Supabase
      const { data, error } = await supabase
        .from('export_contracts')
        .insert(contract)
        .select();
        
      if (error) throw error;
      
      showSuccessToast(toast, `Contract "${contractName}" saved successfully`);
      return data[0];
    } catch (err) {
      console.error("Error saving contract:", err);
      setError(err.message);
      showErrorToast(toast, `Failed to save contract: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch saved contracts
   * @param {string} templateType - Optional filter by contract type
   */
  const fetchContracts = async (templateType = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('export_contracts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (templateType) {
        query = query.eq('type', templateType);
      }
      
      const data = await fromSupabase(query);
      return data;
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError(err.message);
      showErrorToast(toast, `Failed to fetch contracts: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get a single contract by ID
   * @param {string} contractId - Contract ID to fetch
   */
  const getContractById = async (contractId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fromSupabase(
        supabase
          .from('export_contracts')
          .select('*')
          .eq('id', contractId)
          .single()
      );
      
      return data;
    } catch (err) {
      console.error("Error fetching contract:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveContract,
    fetchContracts,
    getContractById
  };
};
