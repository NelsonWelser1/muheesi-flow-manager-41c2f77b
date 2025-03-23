
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const useFarmInformation = (farmId = null) => {
  const [formData, setFormData] = useState({
    manager_name: '',
    supervisor_name: '',
    farm_name: '',
    coffee_type: '',
    farm_size: '',
    daily_production: '',
    weekly_production: '',
    monthly_production: '',
    quarterly_production: '',
    annual_production: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch farm information if farmId is provided
  useEffect(() => {
    if (farmId) {
      fetchFarmInformation(farmId);
    }
  }, [farmId]);

  const fetchFarmInformation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('farm_information')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching farm information:', error);
        setError(error.message);
        return;
      }
      
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching farm information:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('farm_information')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching farms:', error);
        setError(error.message);
        showErrorToast(toast, `Failed to load farms: ${error.message}`);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching farms:', err);
      setError(err.message);
      showErrorToast(toast, `Failed to load farms: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveFarmInformation = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      const requiredFields = ['manager_name', 'supervisor_name', 'farm_name', 'coffee_type', 'farm_size'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        const errorMessage = `Please fill in all required fields: ${missingFields.join(', ')}`;
        setError(errorMessage);
        showErrorToast(toast, errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Validate numeric fields
      const numericFields = [
        'farm_size', 'daily_production', 'weekly_production', 
        'monthly_production', 'quarterly_production', 'annual_production'
      ];
      
      const dataToSubmit = { ...formData };
      
      // Convert numeric fields and validate
      for (const field of numericFields) {
        if (dataToSubmit[field]) {
          const value = parseFloat(dataToSubmit[field]);
          if (isNaN(value) || value <= 0) {
            if (field === 'farm_size') {
              const errorMessage = `${field.replace('_', ' ')} must be a positive number`;
              setError(errorMessage);
              showErrorToast(toast, errorMessage);
              return { success: false, error: errorMessage };
            } else if (value < 0) {
              const errorMessage = `${field.replace('_', ' ')} cannot be negative`;
              setError(errorMessage);
              showErrorToast(toast, errorMessage);
              return { success: false, error: errorMessage };
            }
          }
          dataToSubmit[field] = value || null;
        } else {
          // Set optional numeric fields to null if empty
          dataToSubmit[field] = null;
        }
      }
      
      let result;
      
      if (farmId) {
        // Update existing farm
        const { data, error } = await supabase
          .from('farm_information')
          .update(dataToSubmit)
          .eq('id', farmId)
          .select();
        
        if (error) {
          console.error('Error updating farm information:', error);
          setError(error.message);
          showErrorToast(toast, `Failed to update farm: ${error.message}`);
          return { success: false, error };
        }
        
        result = data[0];
        showSuccessToast(toast, `Farm "${dataToSubmit.farm_name}" updated successfully`);
      } else {
        // Insert new farm
        const { data, error } = await supabase
          .from('farm_information')
          .insert([dataToSubmit])
          .select();
        
        if (error) {
          console.error('Error creating farm information:', error);
          setError(error.message);
          showErrorToast(toast, `Failed to save farm: ${error.message}`);
          return { success: false, error };
        }
        
        result = data[0];
        showSuccessToast(toast, `Farm "${dataToSubmit.farm_name}" saved successfully`);
        
        // Reset form after successful insert
        setFormData({
          manager_name: '',
          supervisor_name: '',
          farm_name: '',
          coffee_type: '',
          farm_size: '',
          daily_production: '',
          weekly_production: '',
          monthly_production: '',
          quarterly_production: '',
          annual_production: '',
          notes: ''
        });
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error('Unexpected error saving farm information:', err);
      setError(err.message);
      showErrorToast(toast, `Failed to save farm: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    loading,
    saving,
    error,
    setFormData,
    handleInputChange,
    handleSelectChange,
    saveFarmInformation,
    fetchAllFarms
  };
};
