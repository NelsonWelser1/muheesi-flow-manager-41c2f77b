
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';

export const useAssociationForm = (initialAssociation = null) => {
  const [formData, setFormData] = useState({
    association_name: '',
    registration_number: '',
    association_type: 'farmers',
    member_count: '',
    total_farm_area: '',
    coffee_types: 'arabica'
  });
  
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Set initial data if provided
  useEffect(() => {
    if (initialAssociation) {
      setFormData(initialAssociation);
    }
  }, [initialAssociation]);

  // Fetch all associations
  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const data = await fromSupabase(
        supabase
          .from('associations')
          .select('*')
          .order('created_at', { ascending: false })
      );
      setAssociations(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching associations:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch associations on component mount
  useEffect(() => {
    fetchAssociations();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save association to database
  const saveAssociation = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!formData.association_name) {
        throw new Error('Association name is required');
      }
      
      // Prepare data for saving
      const dataToSave = {
        ...formData,
        member_count: formData.member_count ? parseInt(formData.member_count, 10) : null,
        total_farm_area: formData.total_farm_area ? parseFloat(formData.total_farm_area) : null
      };
      
      // Insert or update based on whether we have an id
      let result;
      if (formData.id) {
        result = await fromSupabase(
          supabase
            .from('associations')
            .update(dataToSave)
            .eq('id', formData.id)
            .select()
        );
      } else {
        result = await fromSupabase(
          supabase
            .from('associations')
            .insert(dataToSave)
            .select()
        );
      }
      
      // Reset form and refresh list
      setFormData({
        association_name: '',
        registration_number: '',
        association_type: 'farmers',
        member_count: '',
        total_farm_area: '',
        coffee_types: 'arabica'
      });
      
      await fetchAssociations();
      return true;
    } catch (error) {
      console.error('Error saving association:', error);
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    associations,
    loading,
    saving,
    error,
    handleInputChange,
    handleSelectChange,
    saveAssociation,
    fetchAssociations,
    setFormData
  };
};
