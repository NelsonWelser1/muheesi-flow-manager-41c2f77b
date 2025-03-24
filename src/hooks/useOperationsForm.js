
import { useState } from 'react';

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

  // Save operation to local state only (database functionality removed)
  const saveOperation = async (associationId) => {
    if (!associationId) {
      setError("Association ID is required");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Create a new operation object with current timestamp
      const newOperation = {
        id: `local-${Date.now()}`,
        association_id: associationId,
        next_meeting_date: formData.next_meeting_date,
        training_schedule: formData.training_schedule,
        collective_resources: formData.collective_resources,
        shared_equipment: formData.shared_equipment,
        status: formData.status || 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to local state
      setOperations(prev => [newOperation, ...prev]);
      
      // Reset form
      setFormData({
        next_meeting_date: null,
        training_schedule: null,
        collective_resources: '',
        shared_equipment: '',
        status: 'scheduled'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving operation:', error);
      setError(error.message);
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
    saveOperation
  };
};
