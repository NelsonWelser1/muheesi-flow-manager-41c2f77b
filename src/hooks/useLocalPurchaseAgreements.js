
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { runLocalPurchaseAgreementMigration } from '@/integrations/supabase/migrations/runLocalPurchaseAgreementMigration';

export const useLocalPurchaseAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Run migration when the hook is first used
  useEffect(() => {
    const initializeTable = async () => {
      const { success, error } = await runLocalPurchaseAgreementMigration();
      if (!success) {
        console.error('Failed to initialize local_purchase_agreements table:', error);
      }
    };
    
    initializeTable();
  }, []);

  // Generate contract number with format LPA-YYYY-XXXX
  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `LPA-${year}-${randomId}`;
  };

  // Fetch all agreements
  const fetchAgreements = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('local_purchase_agreements')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.status) {
        query = query.eq('contract_status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`buyer_name.ilike.%${filters.search}%,supplier_name.ilike.%${filters.search}%,contract_number.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setAgreements(data || []);
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching agreements:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to fetch agreements: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch a single agreement by ID
  const getAgreementById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching agreement:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to fetch agreement: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save a new agreement
  const saveAgreement = useCallback(async (agreementData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!agreementData.supplier_name) {
        throw new Error("Supplier name is required");
      }
      
      // Generate contract number if not provided
      if (!agreementData.contract_number) {
        agreementData.contract_number = generateContractNumber();
      }
      
      // Ensure agreement_date is valid
      if (!agreementData.agreement_date) {
        agreementData.agreement_date = new Date().toISOString().split('T')[0];
      }
      
      // Calculate total value from items
      if (agreementData.items && Array.isArray(agreementData.items)) {
        agreementData.total_value = agreementData.items.reduce(
          (total, item) => total + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 
          0
        );
      } else {
        agreementData.total_value = 0;
        agreementData.items = [];
      }
      
      // Set default status if not provided
      if (!agreementData.contract_status) {
        agreementData.contract_status = 'draft';
      }
      
      // Insert into database
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .insert(agreementData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Local Purchase Agreement #${data.contract_number} saved successfully`,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error saving agreement:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to save agreement: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update an existing agreement
  const updateAgreement = useCallback(async (id, agreementData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!agreementData.supplier_name) {
        throw new Error("Supplier name is required");
      }
      
      // Calculate total value from items
      if (agreementData.items && Array.isArray(agreementData.items)) {
        agreementData.total_value = agreementData.items.reduce(
          (total, item) => total + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 
          0
        );
      }
      
      // Update in database
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .update(agreementData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Local Purchase Agreement #${data.contract_number} updated successfully`,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating agreement:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to update agreement: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete an agreement
  const deleteAgreement = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get agreement first to reference in success message
      const { data: agreement } = await supabase
        .from('local_purchase_agreements')
        .select('contract_number')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('local_purchase_agreements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Local Purchase Agreement ${agreement?.contract_number || id} deleted successfully`,
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting agreement:', err);
      setError(err);
      
      toast({
        title: "Error",
        description: `Failed to delete agreement: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    agreements,
    loading,
    error,
    fetchAgreements,
    getAgreementById,
    saveAgreement,
    updateAgreement,
    deleteAgreement,
    generateContractNumber
  };
};
