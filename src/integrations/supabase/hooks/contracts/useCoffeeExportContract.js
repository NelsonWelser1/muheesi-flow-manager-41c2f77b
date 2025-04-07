
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

/**
 * Custom hook for managing coffee export contracts
 */
export const useCoffeeExportContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all coffee export contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching coffee export contracts from Supabase...');
      
      const { data, error } = await supabase
        .from('coffee_export_contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching coffee export contracts:', error);
        setError(error.message);
        showErrorToast(toast, `Error loading contracts: ${error.message}`);
        return;
      }
      
      console.log(`Fetched ${data?.length || 0} coffee export contracts successfully`);
      setContracts(data || []);
      
    } catch (err) {
      console.error('Unexpected error fetching coffee export contracts:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save a coffee export contract
  const saveContract = async (contractData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!contractData.contract_number) {
        const error = 'Contract number is required';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }

      if (!contractData.contract_date) {
        const error = 'Contract date is required';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }

      if (!contractData.seller_name) {
        const error = 'Seller name is required';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }

      if (!contractData.buyer_name) {
        const error = 'Buyer name is required';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }

      if (!contractData.products || !Array.isArray(contractData.products) || contractData.products.length === 0) {
        const error = 'At least one product is required';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }
      
      console.log('Saving coffee export contract to Supabase:', contractData);
      
      // Ensure arrays are properly formatted as JSON
      const contractToInsert = {
        contract_number: contractData.contract_number,
        contract_date: contractData.contract_date,
        
        // Seller details
        seller_name: contractData.seller_name,
        seller_address: contractData.seller_address || '',
        seller_registration: contractData.seller_registration || '',
        seller_contact: contractData.seller_contact || '',
        seller_email: contractData.seller_email || '',
        
        // Buyer details
        buyer_name: contractData.buyer_name,
        buyer_address: contractData.buyer_address || '',
        buyer_registration: contractData.buyer_registration || '',
        buyer_contact: contractData.buyer_contact || '',
        buyer_email: contractData.buyer_email || '',
        
        // Products and specifications
        products: JSON.stringify(contractData.products || []),
        quality_specifications: JSON.stringify(contractData.quality_specifications || []),
        payment_terms_items: JSON.stringify(contractData.payment_terms_items || []),
        
        // Shipping details
        shipping_incoterm: contractData.shipping_incoterm || '',
        shipping_packaging: contractData.shipping_packaging || '',
        shipping_loading_port: contractData.shipping_loading_port || '',
        shipping_destination: contractData.shipping_destination || '',
        shipping_latest_date: contractData.shipping_latest_date || '',
        shipping_timeline: contractData.shipping_timeline || '',
        additional_shipping_terms: contractData.additional_shipping_terms || '',
        
        // Certification details
        certifications: JSON.stringify(contractData.certifications || []),
        
        // Insurance and risk
        insurance_requirements: contractData.insurance_requirements || '',
        risk_transfer: contractData.risk_transfer || '',
        
        // Inspection
        inspection_method: contractData.inspection_method || '',
        inspection_location: contractData.inspection_location || '',
        inspection_timeline: contractData.inspection_timeline || '',
        
        // Quality claims
        quality_claims_period: contractData.quality_claims_period || '',
        quality_claims_process: contractData.quality_claims_process || '',
        
        // Defaults and remedies
        defaults_remedies: contractData.defaults_remedies || '',
        
        // Force majeure
        force_majeure: contractData.force_majeure || '',
        
        // Governing law
        governing_law: contractData.governing_law || '',
        dispute_resolution: contractData.dispute_resolution || '',
        
        // Signatures
        seller_signature_name: contractData.seller_signature_name || '',
        seller_signature_title: contractData.seller_signature_title || '',
        seller_signature_date: contractData.seller_signature_date || '',
        seller_signature_value: contractData.seller_signature_value || '',
        
        buyer_signature_name: contractData.buyer_signature_name || '',
        buyer_signature_title: contractData.buyer_signature_title || '',
        buyer_signature_date: contractData.buyer_signature_date || '',
        buyer_signature_value: contractData.buyer_signature_value || '',
        
        company_stamp: contractData.company_stamp || '',
        
        // Metadata
        total_contract_value: parseFloat(contractData.total_contract_value || 0),
        contract_status: contractData.contract_status || 'draft'
      };
      
      const { data, error } = await supabase
        .from('coffee_export_contracts')
        .insert([contractToInsert])
        .select();
      
      if (error) {
        console.error('Error saving coffee export contract:', error);
        setError(error.message);
        showErrorToast(toast, `Error saving contract: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Coffee export contract saved successfully:', data);
      
      // Update the local state with the new contract
      setContracts(prevContracts => [data[0], ...prevContracts]);
      
      showSuccessToast(toast, `Contract for ${contractData.buyer_name} saved successfully`);
      return { success: true, data: data[0] };
      
    } catch (err) {
      console.error('Unexpected error saving coffee export contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get a single contract by ID
  const getContractById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching coffee export contract with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('coffee_export_contracts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching coffee export contract with ID ${id}:`, error);
        setError(error.message);
        showErrorToast(toast, `Error loading contract: ${error.message}`);
        return null;
      }
      
      console.log('Contract fetched successfully:', data);
      
      // Parse JSON fields
      if (data) {
        try {
          data.products = JSON.parse(data.products);
          data.quality_specifications = JSON.parse(data.quality_specifications);
          data.payment_terms_items = JSON.parse(data.payment_terms_items);
          data.certifications = data.certifications ? JSON.parse(data.certifications) : [];
        } catch (e) {
          console.warn('Error parsing JSON fields:', e);
        }
      }
      
      return data;
      
    } catch (err) {
      console.error('Unexpected error fetching coffee export contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing contract
  const updateContract = async (id, contractData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Same validations as saveContract
      if (!contractData.contract_number || !contractData.contract_date || 
          !contractData.seller_name || !contractData.buyer_name ||
          !contractData.products || !Array.isArray(contractData.products) || 
          contractData.products.length === 0) {
        const error = 'Missing required fields';
        setError(error);
        showErrorToast(toast, error);
        return { success: false, error };
      }
      
      console.log(`Updating coffee export contract with ID: ${id}`, contractData);
      
      // Similar to saveContract, prepare the data
      const contractToUpdate = {
        contract_number: contractData.contract_number,
        contract_date: contractData.contract_date,
        seller_name: contractData.seller_name,
        seller_address: contractData.seller_address || '',
        seller_registration: contractData.seller_registration || '',
        seller_contact: contractData.seller_contact || '',
        seller_email: contractData.seller_email || '',
        buyer_name: contractData.buyer_name,
        buyer_address: contractData.buyer_address || '',
        buyer_registration: contractData.buyer_registration || '',
        buyer_contact: contractData.buyer_contact || '',
        buyer_email: contractData.buyer_email || '',
        products: JSON.stringify(contractData.products || []),
        quality_specifications: JSON.stringify(contractData.quality_specifications || []),
        payment_terms_items: JSON.stringify(contractData.payment_terms_items || []),
        shipping_incoterm: contractData.shipping_incoterm || '',
        shipping_packaging: contractData.shipping_packaging || '',
        shipping_loading_port: contractData.shipping_loading_port || '',
        shipping_destination: contractData.shipping_destination || '',
        shipping_latest_date: contractData.shipping_latest_date || '',
        shipping_timeline: contractData.shipping_timeline || '',
        additional_shipping_terms: contractData.additional_shipping_terms || '',
        certifications: JSON.stringify(contractData.certifications || []),
        insurance_requirements: contractData.insurance_requirements || '',
        risk_transfer: contractData.risk_transfer || '',
        inspection_method: contractData.inspection_method || '',
        inspection_location: contractData.inspection_location || '',
        inspection_timeline: contractData.inspection_timeline || '',
        quality_claims_period: contractData.quality_claims_period || '',
        quality_claims_process: contractData.quality_claims_process || '',
        defaults_remedies: contractData.defaults_remedies || '',
        force_majeure: contractData.force_majeure || '',
        governing_law: contractData.governing_law || '',
        dispute_resolution: contractData.dispute_resolution || '',
        seller_signature_name: contractData.seller_signature_name || '',
        seller_signature_title: contractData.seller_signature_title || '',
        seller_signature_date: contractData.seller_signature_date || '',
        seller_signature_value: contractData.seller_signature_value || '',
        buyer_signature_name: contractData.buyer_signature_name || '',
        buyer_signature_title: contractData.buyer_signature_title || '',
        buyer_signature_date: contractData.buyer_signature_date || '',
        buyer_signature_value: contractData.buyer_signature_value || '',
        company_stamp: contractData.company_stamp || '',
        total_contract_value: parseFloat(contractData.total_contract_value || 0),
        contract_status: contractData.contract_status || 'draft'
      };
      
      const { data, error } = await supabase
        .from('coffee_export_contracts')
        .update(contractToUpdate)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating coffee export contract:', error);
        setError(error.message);
        showErrorToast(toast, `Error updating contract: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Coffee export contract updated successfully:', data);
      
      // Update the local state
      setContracts(prevContracts => {
        const updatedContracts = [...prevContracts];
        const index = updatedContracts.findIndex(contract => contract.id === id);
        if (index !== -1) {
          updatedContracts[index] = data[0];
        }
        return updatedContracts;
      });
      
      showSuccessToast(toast, `Contract for ${contractData.buyer_name} updated successfully`);
      return { success: true, data: data[0] };
      
    } catch (err) {
      console.error('Unexpected error updating coffee export contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete a contract
  const deleteContract = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Deleting coffee export contract with ID: ${id}`);
      
      const { error } = await supabase
        .from('coffee_export_contracts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting coffee export contract:', error);
        setError(error.message);
        showErrorToast(toast, `Error deleting contract: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Coffee export contract deleted successfully');
      
      // Update the local state
      setContracts(prevContracts => prevContracts.filter(contract => contract.id !== id));
      
      showSuccessToast(toast, 'Contract deleted successfully');
      return { success: true };
      
    } catch (err) {
      console.error('Unexpected error deleting coffee export contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Load contracts when component mounts
  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    saveContract,
    updateContract,
    deleteContract,
    fetchContracts,
    getContractById
  };
};
