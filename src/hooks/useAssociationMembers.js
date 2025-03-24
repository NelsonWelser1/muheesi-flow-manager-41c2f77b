
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { fromSupabase } from '@/integrations/supabase/utils/supabaseUtils';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useAssociationMembers = (associationId = null) => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    phone: '',
    farmSize: '',
    coffeeType: 'arabica',
    experience: '',
    photo: null,
    photoUrl: null,
    memberLevel: 'bronze',
    status: 'active'
  });

  // Fetch all members for the association
  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('association_members')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by association_id if provided
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const data = await fromSupabase(query);
      setMembers(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching association members:', error);
      setError(error.message);
      showErrorToast(toast, `Failed to load members: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, [associationId]);

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

  // Handle photo changes
  const handlePhotoChange = (file) => {
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  // Upload photo to Supabase storage
  const uploadPhoto = async (file) => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `association_members/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  // Save member to database
  const saveMember = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!formData.fullName) {
        throw new Error('Member name is required');
      }
      
      // Upload photo if available
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
      }
      
      // Prepare data for saving
      const dataToSave = {
        association_id: associationId,
        full_name: formData.fullName,
        location: formData.location,
        phone: formData.phone,
        farm_size: formData.farmSize ? parseFloat(formData.farmSize) : null,
        coffee_type: formData.coffeeType,
        experience: formData.experience ? parseInt(formData.experience, 10) : null,
        photo_url: photoUrl,
        member_level: 'bronze', // Default for new members
        status: 'active'
      };
      
      // Insert or update based on whether we have an id
      let result;
      if (formData.id) {
        result = await fromSupabase(
          supabase
            .from('association_members')
            .update(dataToSave)
            .eq('id', formData.id)
            .select()
        );
        showSuccessToast(toast, `${formData.fullName} has been updated successfully.`);
      } else {
        result = await fromSupabase(
          supabase
            .from('association_members')
            .insert(dataToSave)
            .select()
        );
        showSuccessToast(toast, `${formData.fullName} has been added to the association.`);
      }
      
      // Reset form and refresh list
      setFormData({
        fullName: '',
        location: '',
        phone: '',
        farmSize: '',
        coffeeType: 'arabica',
        experience: '',
        photo: null,
        photoUrl: null,
        memberLevel: 'bronze',
        status: 'active'
      });
      
      await fetchMembers();
      return true;
    } catch (error) {
      console.error('Error saving association member:', error);
      setError(error.message);
      showErrorToast(toast, error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    members,
    loading,
    saving,
    error,
    handleInputChange,
    handleSelectChange,
    handlePhotoChange,
    saveMember,
    fetchMembers,
    setFormData
  };
};
