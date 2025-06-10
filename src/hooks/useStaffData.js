import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';

export const useStaffData = (farmId) => {
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStaffData = async () => {
    setIsLoading(true);
    setError(null);
    
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
      setError(err.message);
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
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!newStaff.firstName || !newStaff.lastName || !newStaff.contactNumber) {
        throw new Error('First name, last name, and contact number are required');
      }
      
      // Prepare data for insertion
      const staffToInsert = {
        farm_id: farmId,
        first_name: newStaff.firstName,
        last_name: newStaff.lastName,
        role: newStaff.role || 'farm_worker',
        contact_number: newStaff.contactNumber,
        email: newStaff.email || null,
        start_date: newStaff.startDate || null,
        salary: newStaff.salary ? parseFloat(newStaff.salary) : null,
        status: newStaff.status || 'active',
        address: newStaff.address || null,
        notes: newStaff.notes || null,
        avatar_url: newStaff.avatar || null
      };
      
      const { data, error } = await supabase
        .from('farm_staff')
        .insert([staffToInsert])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Staff Member Added",
        description: `${newStaff.firstName} ${newStaff.lastName} has been successfully added to the team.`,
        variant: "default"
      });
      
      // Refresh staff data
      await fetchStaffData();
      
      return data[0];
    } catch (err) {
      console.error('Error adding staff member:', err);
      toast({
        title: "Error Adding Staff",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStaffMember = async (id, updatedStaff) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!updatedStaff.firstName || !updatedStaff.lastName || !updatedStaff.contactNumber) {
        throw new Error('First name, last name, and contact number are required');
      }
      
      // Prepare data for update
      const staffToUpdate = {
        first_name: updatedStaff.firstName,
        last_name: updatedStaff.lastName,
        role: updatedStaff.role || 'farm_worker',
        contact_number: updatedStaff.contactNumber,
        email: updatedStaff.email || null,
        start_date: updatedStaff.startDate || null,
        salary: updatedStaff.salary ? parseFloat(updatedStaff.salary) : null,
        status: updatedStaff.status || 'active',
        address: updatedStaff.address || null,
        notes: updatedStaff.notes || null,
        avatar_url: updatedStaff.avatar || null
      };
      
      const { data, error } = await supabase
        .from('farm_staff')
        .update(staffToUpdate)
        .eq('id', id)
        .eq('farm_id', farmId)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Staff Member Updated",
        description: `${updatedStaff.firstName} ${updatedStaff.lastName}'s information has been successfully updated.`,
        variant: "default"
      });
      
      // Refresh staff data
      await fetchStaffData();
      
      return data[0];
    } catch (err) {
      console.error('Error updating staff member:', err);
      toast({
        title: "Error Updating Staff",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStaffMember = async (id) => {
    try {
      // Find the staff member to be deleted for the notification message
      const staffToDelete = staffData.find(staff => staff.id === id);
      
      const { error } = await supabase
        .from('farm_staff')
        .delete()
        .eq('id', id)
        .eq('farm_id', farmId);
      
      if (error) throw error;
      
      // Update local state to remove the deleted staff member
      setStaffData(staffData.filter(staff => staff.id !== id));
      
      toast({
        title: "Staff Member Removed",
        description: staffToDelete 
          ? `${staffToDelete.firstName} ${staffToDelete.lastName} has been removed from the team.` 
          : "Staff member has been removed.",
        variant: "default"
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting staff member:', err);
      toast({
        title: "Error Removing Staff",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    if (farmId) {
      fetchStaffData();
    }
    
    // Set up real-time subscription for staff data changes
    const channel = supabase
      .channel('farm_staff_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'farm_staff',
        filter: `farm_id=eq.${farmId}`
      }, () => {
        fetchStaffData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
