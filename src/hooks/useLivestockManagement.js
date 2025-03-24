
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useLivestockManagement = (associationId = null) => {
  const [formData, setFormData] = useState({
    livestock_type: '',
    quantity: 0,
    health_status: '',
    feeding_schedule: '',
    breeding_program: '',
    vaccination_date: null,
    notes: '',
    status: 'active'
  });
  
  const [livestockRecords, setLivestockRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch livestock records associated with the provided association ID
  const fetchLivestockByAssociationId = async (id) => {
    if (!id) return [];
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('livestock_management')
        .select('*')
        .eq('association_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching livestock for association:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch all livestock records with optional filters
  const fetchAllLivestockRecords = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('livestock_management')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Apply search filter in-memory for more complex searching
      let filteredData = data || [];
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(record => {
          return (
            (record.livestock_type && record.livestock_type.toLowerCase().includes(search)) ||
            (record.health_status && record.health_status.toLowerCase().includes(search)) ||
            (record.breeding_program && record.breeding_program.toLowerCase().includes(search)) ||
            (record.notes && record.notes.toLowerCase().includes(search))
          );
        });
      }
      
      setLivestockRecords(filteredData);
      return filteredData;
    } catch (error) {
      console.error('Error fetching livestock records:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      livestock_type: '',
      quantity: 0,
      health_status: '',
      feeding_schedule: '',
      breeding_program: '',
      vaccination_date: null,
      notes: '',
      status: 'active'
    });
  };

  // Initialize form with a record's data
  const initializeFormWithRecord = (record) => {
    if (!record) return;
    
    setFormData({
      livestock_type: record.livestock_type || '',
      quantity: record.quantity || 0,
      health_status: record.health_status || '',
      feeding_schedule: record.feeding_schedule || '',
      breeding_program: record.breeding_program || '',
      vaccination_date: record.vaccination_date ? new Date(record.vaccination_date) : null,
      notes: record.notes || '',
      status: record.status || 'active'
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
    let processedValue = value;
    
    // Special handling for number fields
    if (name === 'quantity') {
      processedValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save livestock record to database
  const saveLivestockRecord = async (associationId) => {
    if (!associationId) {
      setError("Association ID is required");
      return { success: false, message: "Association ID is required" };
    }
    
    // Validate form data
    if (!formData.livestock_type) {
      setError("Livestock type is required");
      return { success: false, message: "Livestock type is required" };
    }
    
    if (formData.quantity < 0) {
      setError("Quantity cannot be negative");
      return { success: false, message: "Quantity cannot be negative" };
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Prepare data for saving
      const dataToSave = {
        association_id: associationId,
        livestock_type: formData.livestock_type,
        quantity: formData.quantity,
        health_status: formData.health_status,
        feeding_schedule: formData.feeding_schedule,
        breeding_program: formData.breeding_program,
        vaccination_date: formData.vaccination_date,
        notes: formData.notes,
        status: formData.status || 'active'
      };
      
      const { data, error } = await supabase
        .from('livestock_management')
        .insert(dataToSave)
        .select();
      
      if (error) throw error;
      
      // Reset form
      resetForm();
      
      // Refresh livestock list
      await fetchAllLivestockRecords();
      
      return { success: true, message: "Livestock record saved successfully" };
    } catch (error) {
      console.error('Error saving livestock record:', error);
      setError(error.message);
      return { success: false, message: error.message || "Failed to save livestock record" };
    } finally {
      setSaving(false);
    }
  };

  // Update an existing livestock record
  const updateLivestockRecord = async (id, updatedData) => {
    if (!id) {
      setError("Record ID is required");
      return { success: false, message: "Record ID is required" };
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('livestock_management')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh livestock list
      await fetchAllLivestockRecords();
      
      return { success: true, message: "Livestock record updated successfully" };
    } catch (error) {
      console.error('Error updating livestock record:', error);
      setError(error.message);
      return { success: false, message: error.message || "Failed to update livestock record" };
    } finally {
      setSaving(false);
    }
  };

  // Delete a livestock record
  const deleteLivestockRecord = async (id) => {
    if (!id) {
      setError("Record ID is required");
      return { success: false, message: "Record ID is required" };
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('livestock_management')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setLivestockRecords(livestockRecords.filter(record => record.id !== id));
      
      return { success: true, message: "Livestock record deleted successfully" };
    } catch (error) {
      console.error('Error deleting livestock record:', error);
      setError(error.message);
      return { success: false, message: error.message || "Failed to delete livestock record" };
    } finally {
      setSaving(false);
    }
  };

  // Fetch livestock records when the associationId changes
  useEffect(() => {
    if (associationId) {
      fetchLivestockByAssociationId(associationId).then(data => {
        setLivestockRecords(data);
        // If there's existing data, initialize the form with the latest record
        if (data && data.length > 0) {
          initializeFormWithRecord(data[0]);
        }
      });
    } else {
      fetchAllLivestockRecords();
    }
  }, [associationId]);

  // Apply filters when they change
  useEffect(() => {
    fetchAllLivestockRecords({
      status: filterStatus,
      searchTerm: searchTerm
    });
  }, [filterStatus, searchTerm]);

  return {
    formData,
    livestockRecords,
    loading,
    saving,
    error,
    filterStatus,
    searchTerm,
    setFilterStatus,
    setSearchTerm,
    handleDateChange,
    handleInputChange,
    handleSelectChange,
    saveLivestockRecord,
    updateLivestockRecord,
    deleteLivestockRecord,
    fetchAllLivestockRecords,
    resetForm,
    initializeFormWithRecord
  };
};
