
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const useStaffData = (farmId) => {
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('staff_members')
        .select('*')
        .order('created_at', { ascending: false });

      // Add farm ID filter if provided
      if (farmId) {
        query = query.eq('farm_id', farmId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching staff data:', fetchError);
        setError(fetchError.message);
        showErrorToast(toast, `Failed to load staff data: ${fetchError.message}`);
        return [];
      }

      setStaffData(data || []);
      return data;
    } catch (error) {
      console.error('Unexpected error fetching staff data:', error);
      setError('Failed to load staff data. Please try again later.');
      showErrorToast(toast, 'Failed to load staff data. Please try again later.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addStaffMember = async (staffData) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'contactNumber', 'role', 'status'];
      for (const field of requiredFields) {
        if (!staffData[field]) {
          showErrorToast(toast, `${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
          return false;
        }
      }

      // Format the data for insertion
      const staffRecord = {
        first_name: staffData.firstName,
        last_name: staffData.lastName,
        contact_number: staffData.contactNumber,
        email: staffData.email,
        role: staffData.role,
        start_date: staffData.startDate,
        salary: staffData.salary,
        status: staffData.status,
        address: staffData.address,
        notes: staffData.notes,
        farm_id: farmId || null
      };

      console.log('Submitting staff data:', staffRecord);

      const { data, error: insertError } = await supabase
        .from('staff_members')
        .insert([staffRecord])
        .select();

      if (insertError) {
        console.error('Error adding staff member:', insertError);
        showErrorToast(toast, `Failed to add staff member: ${insertError.message}`);
        return false;
      }

      console.log('Staff member added successfully:', data);
      showSuccessToast(toast, 'Staff member added successfully');
      
      // Refresh the staff data
      await fetchStaffData();
      return true;
    } catch (error) {
      console.error('Unexpected error adding staff member:', error);
      showErrorToast(toast, 'Failed to add staff member. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStaffMember = async (id, staffData) => {
    try {
      setIsSubmitting(true);
      
      // Format the data for update
      const staffRecord = {
        first_name: staffData.firstName,
        last_name: staffData.lastName,
        contact_number: staffData.contactNumber,
        email: staffData.email,
        role: staffData.role,
        start_date: staffData.startDate,
        salary: staffData.salary,
        status: staffData.status,
        address: staffData.address,
        notes: staffData.notes,
        farm_id: farmId || null
      };

      const { data, error: updateError } = await supabase
        .from('staff_members')
        .update(staffRecord)
        .eq('id', id)
        .select();

      if (updateError) {
        console.error('Error updating staff member:', updateError);
        showErrorToast(toast, `Failed to update staff member: ${updateError.message}`);
        return false;
      }

      showSuccessToast(toast, 'Staff member updated successfully');
      await fetchStaffData();
      return true;
    } catch (error) {
      console.error('Unexpected error updating staff member:', error);
      showErrorToast(toast, 'Failed to update staff member. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStaffMember = async (id) => {
    try {
      setIsSubmitting(true);

      const { error: deleteError } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting staff member:', deleteError);
        showErrorToast(toast, `Failed to delete staff member: ${deleteError.message}`);
        return false;
      }

      showSuccessToast(toast, 'Staff member deleted successfully');
      await fetchStaffData();
      return true;
    } catch (error) {
      console.error('Unexpected error deleting staff member:', error);
      showErrorToast(toast, 'Failed to delete staff member. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch staff data on component mount
  useEffect(() => {
    fetchStaffData();
  }, [farmId]);

  return {
    staffData,
    isLoading,
    isSubmitting,
    error,
    fetchStaffData,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember
  };
};
