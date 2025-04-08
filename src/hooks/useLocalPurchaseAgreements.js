
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useLocalPurchaseAgreements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const { toast } = useToast();

  // Generate a contract number with format LPA-YYYY-XXXX
  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `LPA-${year}-${randomId}`;
  };

  // Save a new local purchase agreement
  const saveAgreement = useCallback(async (agreementData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate a contract number if not provided
      if (!agreementData.contract_number) {
        agreementData.contract_number = generateContractNumber();
      }
      
      // Calculate total value if items are provided
      if (agreementData.items && Array.isArray(agreementData.items)) {
        agreementData.total_value = agreementData.items.reduce(
          (total, item) => total + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0), 
          0
        );
      }
      
      // Insert the agreement into the database
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .insert(agreementData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Agreement Saved",
        description: `Contract #${data.contract_number} has been saved successfully.`,
        duration: 5000,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error saving purchase agreement:', err);
      setError(err);
      
      toast({
        title: "Error Saving Agreement",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch all local purchase agreements
  const fetchAgreements = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if table exists
      const { data: tableExists, error: checkError } = await supabase
        .from('local_purchase_agreements')
        .select('id')
        .limit(1)
        .single();
      
      if (checkError && checkError.code === '42P01') {
        console.log('Table does not exist yet');
        setAgreements([]);
        return { success: true, data: [] };
      }
      
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
      console.error('Error fetching purchase agreements:', err);
      setError(err);
      
      // Don't show error toast for table not existing
      if (err.code !== '42P01') {
        toast({
          title: "Error Fetching Agreements",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
      
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
      console.error('Error fetching purchase agreement:', err);
      setError(err);
      
      toast({
        title: "Error Fetching Agreement",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update an existing agreement
  const updateAgreement = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      // Recalculate total value if items are updated
      if (updates.items && Array.isArray(updates.items)) {
        updates.total_value = updates.items.reduce(
          (total, item) => total + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0), 
          0
        );
      }
      
      // Add updated_at timestamp
      updates.updated_at = new Date();
      
      const { data, error } = await supabase
        .from('local_purchase_agreements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Agreement Updated",
        description: `Contract #${data.contract_number} has been updated successfully.`,
        duration: 3000,
      });
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating purchase agreement:', err);
      setError(err);
      
      toast({
        title: "Error Updating Agreement",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    agreements,
    saveAgreement,
    fetchAgreements,
    getAgreementById,
    updateAgreement,
    generateContractNumber
  };
};
