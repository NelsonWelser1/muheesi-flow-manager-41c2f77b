
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useOperationsForm = (associationId = null) => {
  const [formData, setFormData] = useState({
    next_meeting_date: null,
    training_schedule: null,
    collective_resources: '',
    shared_equipment: '',
    status: 'scheduled'
  });
  
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch operations when the component mounts or when filters change
  useEffect(() => {
    if (associationId) {
      fetchOperations();
    }
  }, [associationId, timeRange, statusFilter, searchTerm]);

  // Fetch operations from Supabase
  const fetchOperations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('association_operations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply association filter if provided
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      // Apply status filter if not 'all'
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply time range filter if not 'all'
      if (timeRange && timeRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (timeRange) {
          case 'hour':
            startDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Apply search filter in memory (since Supabase doesn't support full-text search on free tier)
      let filteredData = data || [];
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(op => 
          (op.collective_resources && op.collective_resources.toLowerCase().includes(searchLower)) ||
          (op.shared_equipment && op.shared_equipment.toLowerCase().includes(searchLower)) ||
          (op.status && op.status.toLowerCase().includes(searchLower))
        );
      }
      
      setOperations(filteredData);
    } catch (err) {
      console.error('Error fetching operations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save operation to Supabase
  const saveOperation = async (associationId) => {
    if (!associationId) {
      setError("Association ID is required");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Validate form data
      if (formData.status === '') {
        setError("Status is required");
        return false;
      }
      
      // Create operation object
      const operationData = {
        association_id: associationId,
        next_meeting_date: formData.next_meeting_date,
        training_schedule: formData.training_schedule,
        collective_resources: formData.collective_resources,
        shared_equipment: formData.shared_equipment,
        status: formData.status || 'scheduled'
      };
      
      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('association_operations')
        .insert(operationData)
        .select();
      
      if (insertError) throw insertError;
      
      // Add newly created operation to state
      if (data && data.length > 0) {
        setOperations(prev => [data[0], ...prev]);
      }
      
      // Reset form
      setFormData({
        next_meeting_date: null,
        training_schedule: null,
        collective_resources: '',
        shared_equipment: '',
        status: 'scheduled'
      });
      
      // Refresh operations list
      await fetchOperations();
      
      return true;
    } catch (err) {
      console.error('Error saving operation:', err);
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    operations,
    loading,
    saving,
    error,
    timeRange,
    statusFilter,
    searchTerm,
    setTimeRange,
    setStatusFilter,
    setSearchTerm,
    handleDateChange,
    handleInputChange,
    handleSelectChange,
    saveOperation,
    fetchOperations
  };
};
