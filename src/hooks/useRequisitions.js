
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchRequisitions = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the requisitions table
      let query = supabase
        .from('requisitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.requisitionType && filters.requisitionType !== 'all') {
        query = query.eq('requisition_type', filters.requisitionType);
      }
      
      if (filters.urgencyLevel && filters.urgencyLevel !== 'all') {
        query = query.eq('urgency_level', filters.urgencyLevel);
      }
      
      if (filters.searchTerm) {
        query = query.or(`
          requester_name.ilike.%${filters.searchTerm}%,
          department.ilike.%${filters.searchTerm}%,
          tools_machinery.ilike.%${filters.searchTerm}%,
          repairs.ilike.%${filters.searchTerm}%,
          justification.ilike.%${filters.searchTerm}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setRequisitions(data || []);
      console.log('Fetched requisitions data:', data);
      return data;
    } catch (err) {
      console.error('Error fetching requisitions:', err);
      setError(err.message);
      toast({
        title: "Error fetching requisitions",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchRequisitionsByStatus = async (status) => {
    return await fetchRequisitions({ status });
  };

  const fetchRequisitionsByTimeRange = async (timeRange) => {
    const filters = { timeRange };
    return await fetchRequisitions(filters);
  };

  const searchRequisitions = async (searchTerm) => {
    return await fetchRequisitions({ searchTerm });
  };

  const submitRequisition = async (formData) => {
    try {
      // Map form data to database schema
      const requisitionData = {
        requester_name: formData.requesterName,
        department: formData.department,
        requisition_type: formData.requisitionType,
        tools_machinery: formData.tools || null,
        repairs: formData.repairs || null,
        justification: formData.justification,
        urgency_level: formData.urgencyLevel,
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('requisitions')
        .insert([requisitionData])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Refresh requisitions list
      fetchRequisitions();
      
      toast({
        title: "Requisition submitted",
        description: "Your requisition has been successfully submitted.",
        variant: "default"
      });
      
      return data;
    } catch (err) {
      console.error('Error submitting requisition:', err);
      toast({
        title: "Error submitting requisition",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRequisitions();
  }, []);

  return {
    requisitions,
    loading,
    error,
    fetchRequisitions,
    fetchRequisitionsByStatus,
    fetchRequisitionsByTimeRange,
    searchRequisitions,
    submitRequisition,
    refresh: () => fetchRequisitions()
  };
};

export default useRequisitions;
