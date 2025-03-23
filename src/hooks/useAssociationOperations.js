
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';
import { format, parseISO } from 'date-fns';

export const useAssociationOperations = (associationId = null) => {
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

  // Fetch operations associated with the provided association ID
  const fetchOperationsByAssociationId = async (id) => {
    if (!id) return [];
    
    try {
      setLoading(true);
      const data = await fromSupabase(
        supabase
          .from('association_operations')
          .select('*')
          .eq('association_id', id)
          .order('created_at', { ascending: false })
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching operations for association:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch all operations
  const fetchAllOperations = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('association_operations')
        .select(`
          *,
          associations:association_id (
            association_name
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply time range filter
      if (filters.timeRange && filters.timeRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (filters.timeRange) {
          case 'hour':
            startDate = new Date(now.setHours(now.getHours() - 1));
            break;
          case 'day':
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = null;
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      const data = await fromSupabase(query);
      
      // Apply search filter in-memory for more complex searching
      let filteredData = data || [];
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(op => {
          return (
            (op.collective_resources && op.collective_resources.toLowerCase().includes(search)) ||
            (op.shared_equipment && op.shared_equipment.toLowerCase().includes(search)) ||
            (op.associations?.association_name && op.associations.association_name.toLowerCase().includes(search)) ||
            (op.status && op.status.toLowerCase().includes(search))
          );
        });
      }
      
      setOperations(filteredData);
      return filteredData;
    } catch (error) {
      console.error('Error fetching operations:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initialize form data with operation data if provided
  const initializeFormWithOperation = (operation) => {
    if (!operation) return;
    
    setFormData({
      next_meeting_date: operation.next_meeting_date ? new Date(operation.next_meeting_date) : null,
      training_schedule: operation.training_schedule ? new Date(operation.training_schedule) : null,
      collective_resources: operation.collective_resources || '',
      shared_equipment: operation.shared_equipment || '',
      status: operation.status || 'scheduled'
    });
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

  // Save operation to database
  const saveOperation = async (associationId) => {
    if (!associationId) {
      setError("Association ID is required");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Prepare data for saving
      const dataToSave = {
        association_id: associationId,
        next_meeting_date: formData.next_meeting_date,
        training_schedule: formData.training_schedule,
        collective_resources: formData.collective_resources,
        shared_equipment: formData.shared_equipment,
        status: formData.status || 'scheduled'
      };
      
      const result = await fromSupabase(
        supabase
          .from('association_operations')
          .insert(dataToSave)
          .select()
      );
      
      // Reset form
      setFormData({
        next_meeting_date: null,
        training_schedule: null,
        collective_resources: '',
        shared_equipment: '',
        status: 'scheduled'
      });
      
      // Refresh operations list
      await fetchAllOperations();
      
      return true;
    } catch (error) {
      console.error('Error saving operation:', error);
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update an existing operation
  const updateOperation = async (id, updatedData) => {
    if (!id) {
      setError("Operation ID is required");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await fromSupabase(
        supabase
          .from('association_operations')
          .update(updatedData)
          .eq('id', id)
      );
      
      // Refresh operations list
      await fetchAllOperations();
      
      return true;
    } catch (error) {
      console.error('Error updating operation:', error);
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete an operation
  const deleteOperation = async (id) => {
    if (!id) {
      setError("Operation ID is required");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await fromSupabase(
        supabase
          .from('association_operations')
          .delete()
          .eq('id', id)
      );
      
      // Refresh operations list
      setOperations(operations.filter(op => op.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting operation:', error);
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Fetch the operations when the associationId changes
  useEffect(() => {
    if (associationId) {
      fetchOperationsByAssociationId(associationId).then(data => {
        setOperations(data);
        // If there's an existing operation, initialize the form with it
        if (data && data.length > 0) {
          initializeFormWithOperation(data[0]);
        }
      });
    } else {
      fetchAllOperations();
    }
  }, [associationId]);

  // Apply filters when they change
  useEffect(() => {
    fetchAllOperations({
      status: statusFilter,
      timeRange: timeRange,
      searchTerm: searchTerm
    });
  }, [statusFilter, timeRange, searchTerm]);

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
    updateOperation,
    deleteOperation,
    fetchAllOperations
  };
};
