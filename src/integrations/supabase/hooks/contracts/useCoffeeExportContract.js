import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing coffee export contracts
 */
export const useCoffeeExportContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  // Use a ref to track submission status and prevent duplicate submissions
  const submissionStatusRef = useRef({});

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
      // Generate a submission ID to track this specific save attempt
      const submissionId = uuidv4();
      
      // Check if we're already processing this exact submission
      if (submissionStatusRef.current[contractData.contract_number] === 'processing') {
        console.log('Preventing duplicate submission, already processing this contract');
        showErrorToast(toast, 'This contract is already being saved. Please wait.');
        return { success: false, error: 'Duplicate submission' };
      }
      
      // Mark this contract number as being processed
      submissionStatusRef.current[contractData.contract_number] = 'processing';
      
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!contractData.contract_number) {
        const error = 'Contract number is required';
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }

      if (!contractData.contract_date) {
        const error = 'Contract date is required';
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }

      if (!contractData.seller_name) {
        const error = 'Seller name is required';
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }

      if (!contractData.buyer_name) {
        const error = 'Buyer name is required';
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }

      // Validate products array and ensure it's properly formatted
      if (!contractData.products || !Array.isArray(contractData.products) || contractData.products.length === 0) {
        const error = 'At least one product is required';
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }
      
      // Ensure each product has a unique ID
      const processedProducts = contractData.products.map(product => {
        // If the product already has an id, keep it, otherwise generate one
        if (!product.id) {
          return { ...product, id: `product-${uuidv4()}` };
        }
        return product;
      });
      
      console.log('Saving coffee export contract to Supabase:', contractData);
      
      // Check if a contract with this number already exists
      const { data: existingContract, error: existingError } = await supabase
        .from('coffee_export_contracts')
        .select('id')
        .eq('contract_number', contractData.contract_number)
        .single();
        
      if (existingError && existingError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking for existing contract:', existingError);
        setError(existingError.message);
        showErrorToast(toast, `Error checking for existing contract: ${existingError.message}`);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error: existingError };
      }
      
      if (existingContract) {
        const error = `A contract with number ${contractData.contract_number} already exists`;
        console.error(error);
        setError(error);
        showErrorToast(toast, error);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }
      
      // Prepare the data for insertion
      const contractToInsert = {
        contract_number: contractData.contract_number,
        contract_date: contractData.contract_date,
        seller_name: contractData.seller_name,
        seller_address: contractData.seller_address || '',
        seller_registration: contractData.seller_registration || '',
        buyer_name: contractData.buyer_name,
        buyer_address: contractData.buyer_address || '',
        buyer_registration: contractData.buyer_registration || '',
        products: JSON.stringify(processedProducts || []),
        payment_terms_items: JSON.stringify(contractData.payment_terms_items || []),
        shipping_left_label1: contractData.shipping_left_label1 || 'Incoterm:',
        shipping_left_value1: contractData.shipping_left_value1 || 'FOB Mombasa',
        shipping_left_label2: contractData.shipping_left_label2 || 'Packaging:',
        shipping_left_value2: contractData.shipping_left_value2 || '60kg jute bags with GrainPro liners',
        shipping_left_label3: contractData.shipping_left_label3 || 'Loading Port:',
        shipping_left_value3: contractData.shipping_left_value3 || 'Mombasa, Kenya',
        shipping_right_label1: contractData.shipping_right_label1 || 'Destination:',
        shipping_right_value1: contractData.shipping_right_value1 || 'Hamburg, Germany',
        shipping_right_label2: contractData.shipping_right_label2 || 'Latest Shipment Date:',
        shipping_right_value2: contractData.shipping_right_value2 || 'October 15, 2024',
        shipping_right_label3: contractData.shipping_right_label3 || 'Delivery Timeline:',
        shipping_right_value3: contractData.shipping_right_value3 || '30-45 days from loading',
        additional_shipping_terms_label: contractData.additional_shipping_terms_label || 'Additional Shipping Terms:',
        additional_shipping_terms: contractData.additional_shipping_terms || '',
        for_seller_label: contractData.for_seller_label || 'For and on behalf of SELLER',
        seller_name_label: contractData.seller_name_label || 'Name:',
        seller_name_value: contractData.seller_name_value || '',
        seller_title_label: contractData.seller_title_label || 'Title:',
        seller_title_value: contractData.seller_title_value || '',
        seller_date_label: contractData.seller_date_label || 'Date:',
        seller_date_value: contractData.seller_date_value || '',
        seller_signature_label: contractData.seller_signature_label || 'Signature:',
        seller_signature_value: contractData.seller_signature_value || '',
        for_buyer_label: contractData.for_buyer_label || 'For and on behalf of BUYER',
        buyer_signature_name_label: contractData.buyer_signature_name_label || 'Name:',
        buyer_signature_name_value: contractData.buyer_signature_name_value || '',
        buyer_signature_title_label: contractData.buyer_signature_title_label || 'Title:',
        buyer_signature_title_value: contractData.buyer_signature_title_value || '',
        buyer_signature_date_label: contractData.buyer_signature_date_label || 'Date:',
        buyer_signature_date_value: contractData.buyer_signature_date_value || '',
        buyer_signature_label: contractData.buyer_signature_label || 'Signature:',
        buyer_signature_value: contractData.buyer_signature_value || '',
        company_stamp: contractData.company_stamp || '[Company Seal/Stamp]',
        total_contract_value: parseFloat(contractData.total_contract_value || 0),
        submitted_flag: submissionId // Save a unique flag to track this specific submission
      };
      
      const { data, error } = await supabase
        .from('coffee_export_contracts')
        .insert([contractToInsert])
        .select();
      
      if (error) {
        console.error('Error saving coffee export contract:', error);
        setError(error.message);
        showErrorToast(toast, `Error saving contract: ${error.message}`);
        submissionStatusRef.current[contractData.contract_number] = null;
        return { success: false, error };
      }
      
      console.log('Coffee export contract saved successfully:', data);
      
      // Update the local state with the new contract
      setContracts(prevContracts => [data[0], ...prevContracts]);
      
      // Clear the processing flag
      submissionStatusRef.current[contractData.contract_number] = 'completed';
      
      showSuccessToast(toast, 'Contract saved successfully');
      return { success: true, data: data[0] };
      
    } catch (err) {
      console.error('Unexpected error saving coffee export contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      
      // Clear the processing flag in case of error
      if (contractData && contractData.contract_number) {
        submissionStatusRef.current[contractData.contract_number] = null;
      }
      
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
          // Ensure products array is properly parsed
          if (data.products) {
            if (typeof data.products === 'string') {
              data.products = JSON.parse(data.products);
            }
            // Ensure each product has an ID
            data.products = data.products.map(product => {
              if (!product.id) {
                return { ...product, id: `product-${uuidv4()}` };
              }
              return product;
            });
          } else {
            data.products = [];
          }
          
          // Parse payment terms
          if (data.payment_terms_items) {
            if (typeof data.payment_terms_items === 'string') {
              data.payment_terms_items = JSON.parse(data.payment_terms_items);
            }
          } else {
            data.payment_terms_items = [];
          }
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

  // Load contracts when component mounts
  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    saveContract,
    fetchContracts,
    getContractById
  };
};
