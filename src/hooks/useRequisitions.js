
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

/**
 * Custom hook for managing requisitions
 */
export const useRequisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch all requisitions from Supabase
   */
  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('requisitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRequisitions(data || []);
    } catch (err) {
      console.error('Error fetching requisitions:', err);
      setError(err.message);
      toast.error(`Failed to load requisitions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit a new requisition to Supabase
   */
  const submitRequisition = async (requisitionData) => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      const requiredFields = ['requesterName', 'department', 'requisitionType', 'justification', 'urgencyLevel'];
      const missingFields = requiredFields.filter(field => !requisitionData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Map form data to database schema
      const dbData = {
        requester_name: requisitionData.requesterName,
        department: requisitionData.department,
        requisition_type: requisitionData.requisitionType,
        tools_machinery: requisitionData.requisitionType === 'tools' ? requisitionData.tools : null,
        repairs: requisitionData.requisitionType === 'repairs' ? requisitionData.repairs : null,
        justification: requisitionData.justification,
        urgency_level: requisitionData.urgencyLevel,
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('requisitions')
        .insert(dbData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success("Requisition submitted successfully");
      return data?.[0];
    } catch (err) {
      console.error('Error submitting requisition:', err);
      toast.error(`Failed to submit requisition: ${err.message}`);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Fetch requisitions filtered by status
   */
  const fetchRequisitionsByStatus = async (status) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('requisitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setRequisitions(data || []);
    } catch (err) {
      console.error('Error fetching requisitions by status:', err);
      setError(err.message);
      toast.error(`Failed to load requisitions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch requisitions by time range
   */
  const fetchRequisitionsByTimeRange = async (timeRange) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('requisitions')
        .select('*')
        .order('created_at', { ascending: false });
      
      const now = new Date();
      
      switch (timeRange) {
        case 'hour':
          const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          query = query.gte('created_at', hourAgo.toISOString());
          break;
        case 'today':
          const startOfDay = new Date(now.setHours(0, 0, 0, 0));
          query = query.gte('created_at', startOfDay.toISOString());
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', weekAgo.toISOString());
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          query = query.gte('created_at', monthAgo.toISOString());
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          query = query.gte('created_at', yearAgo.toISOString());
          break;
        default:
          // 'all' or any other value, no filter
          break;
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setRequisitions(data || []);
    } catch (err) {
      console.error('Error fetching requisitions by time range:', err);
      setError(err.message);
      toast.error(`Failed to load requisitions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search requisitions
   */
  const searchRequisitions = async (searchTerm) => {
    try {
      setLoading(true);
      
      if (!searchTerm) {
        return fetchRequisitions();
      }
      
      const { data, error } = await supabase
        .from('requisitions')
        .select('*')
        .or(`requester_name.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%,justification.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRequisitions(data || []);
    } catch (err) {
      console.error('Error searching requisitions:', err);
      setError(err.message);
      toast.error(`Failed to search requisitions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requisitions on component mount
  useEffect(() => {
    fetchRequisitions();
  }, []);

  return {
    requisitions,
    loading,
    error,
    submitting,
    fetchRequisitions,
    submitRequisition,
    fetchRequisitionsByStatus,
    fetchRequisitionsByTimeRange,
    searchRequisitions
  };
};
