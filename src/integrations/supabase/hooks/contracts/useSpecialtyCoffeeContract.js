
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for managing specialty coffee contracts
 */
export const useSpecialtyCoffeeContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch all specialty coffee contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching specialty coffee contracts from Supabase...');
      
      const { data, error } = await supabase
        .from('specialty_coffee_contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching specialty coffee contracts:', error);
        setError(error.message);
        showErrorToast(toast, `Error loading contracts: ${error.message}`);
        return;
      }
      
      console.log(`Fetched ${data?.length || 0} specialty coffee contracts successfully`);
      
      // Parse JSON fields for each contract
      const parsedContracts = (data || []).map(contract => {
        try {
          return {
            ...contract,
            products: typeof contract.products === 'string' 
              ? JSON.parse(contract.products) 
              : contract.products,
            payment_terms_items: typeof contract.payment_terms_items === 'string'
              ? JSON.parse(contract.payment_terms_items)
              : contract.payment_terms_items
          };
        } catch (e) {
          console.warn('Error parsing JSON fields for contract:', e);
          return contract;
        }
      });
      
      setContracts(parsedContracts);
      
    } catch (err) {
      console.error('Unexpected error fetching specialty coffee contracts:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save a specialty coffee contract
  const saveContract = async (contractData) => {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate request');
      return { success: false, error: 'Submission already in progress' };
    }
    
    try {
      setIsSubmitting(true);
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
      
      console.log('Saving specialty coffee contract to Supabase:', contractData);
      
      // Generate a client reference ID to prevent duplicates
      const clientReferenceId = contractData.client_reference_id || uuidv4();
      
      // Ensure products are properly formatted for DB storage
      const formattedProducts = Array.isArray(contractData.products) 
        ? contractData.products.map(product => ({
            id: product.id || `product-${uuidv4()}`,
            description: product.description || '',
            quantity: parseFloat(product.quantity) || 0,
            pricePerKg: parseFloat(product.pricePerKg) || 0,
            totalValue: parseFloat(product.totalValue) || 
              (parseFloat(product.quantity || 0) * parseFloat(product.pricePerKg || 0))
          }))
        : [];
      
      // Ensure payment terms are properly formatted
      const formattedPaymentTerms = Array.isArray(contractData.payment_terms_items)
        ? contractData.payment_terms_items.map(item => {
            // Handle both formats: {description} and {id, text}
            return {
              id: item.id || `term-${uuidv4()}`,
              description: item.description || item.text || ''
            };
          })
        : [];
      
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
        coffee_origin: contractData.coffee_origin || '',
        coffee_variety: contractData.coffee_variety || '',
        coffee_process: contractData.coffee_process || '',
        coffee_grade: contractData.coffee_grade || '',
        coffee_certification: contractData.coffee_certification || '',
        cupping_score: contractData.cupping_score ? parseFloat(contractData.cupping_score) : null,
        products: formattedProducts,
        payment_terms_items: formattedPaymentTerms,
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
        currency: contractData.currency || 'USD',
        client_reference_id: clientReferenceId
      };
      
      const { data, error } = await supabase
        .from('specialty_coffee_contracts')
        .insert([contractToInsert])
        .select();
      
      if (error) {
        console.error('Error saving specialty coffee contract:', error);
        setError(error.message);
        showErrorToast(toast, `Error saving contract: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Specialty coffee contract saved successfully:', data);
      
      // Update the local state with the new contract
      if (data && data.length > 0) {
        // Parse JSON fields if they're stored as strings
        try {
          const parsedData = {
            ...data[0],
            products: typeof data[0].products === 'string' 
              ? JSON.parse(data[0].products) 
              : data[0].products,
            payment_terms_items: typeof data[0].payment_terms_items === 'string'
              ? JSON.parse(data[0].payment_terms_items)
              : data[0].payment_terms_items
          };
          
          setContracts(prevContracts => [parsedData, ...prevContracts]);
        } catch (e) {
          console.warn('Error parsing JSON in saved contract:', e);
          setContracts(prevContracts => [data[0], ...prevContracts]);
        }
      }
      
      showSuccessToast(toast, 'Specialty coffee contract saved successfully');
      return { success: true, data: data[0], clientReferenceId };
      
    } catch (err) {
      console.error('Unexpected error saving specialty coffee contract:', err);
      setError(err.message);
      showErrorToast(toast, `Unexpected error: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Get a single contract by ID
  const getContractById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching specialty coffee contract with ID: ${id}`);
      
      const { data, error } = await supabase
        .from('specialty_coffee_contracts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching specialty coffee contract with ID ${id}:`, error);
        setError(error.message);
        showErrorToast(toast, `Error loading contract: ${error.message}`);
        return null;
      }
      
      console.log('Contract fetched successfully:', data);
      
      // Parse JSON fields
      if (data) {
        try {
          data.products = typeof data.products === 'string' 
            ? JSON.parse(data.products) 
            : data.products;
          
          data.payment_terms_items = typeof data.payment_terms_items === 'string'
            ? JSON.parse(data.payment_terms_items)
            : data.payment_terms_items;
        } catch (e) {
          console.warn('Error parsing JSON fields:', e);
        }
      }
      
      return data;
      
    } catch (err) {
      console.error('Unexpected error fetching specialty coffee contract:', err);
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
    isSubmitting,
    saveContract,
    fetchContracts,
    getContractById
  };
};
