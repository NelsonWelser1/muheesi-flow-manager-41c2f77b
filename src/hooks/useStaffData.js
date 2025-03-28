
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useStaffData = (farmId) => {
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      // Query the staff data table
      const { data, error } = await supabase
        .from('farm_staff')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format and process the data
      const formattedData = (data || []).map(item => ({
        id: item.id,
        firstName: item.first_name || '',
        lastName: item.last_name || '',
        role: item.role || 'farm_worker',
        contactNumber: item.contact_number || '',
        email: item.email || '',
        startDate: item.start_date,
        salary: item.salary || 0,
        status: item.status || 'active',
        address: item.address || '',
        notes: item.notes || '',
        avatar: item.avatar_url || '',
        farm_id: item.farm_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setStaffData(formattedData);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError(err);
      toast({
        title: "Error fetching staff data",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStaffMember = async (newStaff) => {
    try {
      // Prepare data for insertion
      const staffToInsert = {
        first_name: newStaff.firstName,
        last_name: newStaff.lastName,
        role: newStaff.role,
        contact_number: newStaff.contactNumber,
        email: newStaff.email,
        start_date: newStaff.startDate,
        salary: parseFloat(newStaff.salary) || 0,
        status: newStaff.status,
        address: newStaff.address,
        notes: newStaff.notes,
        avatar_url: newStaff.avatar || null,
        farm_id: farmId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('farm_staff')
        .insert([staffToInsert])
        .select();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error adding staff member:', err);
      throw err;
    }
  };

  const updateStaffMember = async (id, updatedStaff) => {
    try {
      // Prepare data for update
      const staffToUpdate = {
        first_name: updatedStaff.firstName,
        last_name: updatedStaff.lastName,
        role: updatedStaff.role,
        contact_number: updatedStaff.contactNumber,
        email: updatedStaff.email,
        start_date: updatedStaff.startDate,
        salary: parseFloat(updatedStaff.salary) || 0,
        status: updatedStaff.status,
        address: updatedStaff.address,
        notes: updatedStaff.notes,
        avatar_url: updatedStaff.avatar || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('farm_staff')
        .update(staffToUpdate)
        .eq('id', id)
        .eq('farm_id', farmId)
        .select();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error updating staff member:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (farmId) {
      fetchStaffData();
    }
  }, [farmId]);

  return {
    staffData,
    isLoading,
    error,
    fetchStaffData,
    addStaffMember,
    updateStaffMember
  };
};
