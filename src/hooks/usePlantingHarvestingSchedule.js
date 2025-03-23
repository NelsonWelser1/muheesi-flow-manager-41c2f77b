
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';
import { format, parseISO } from 'date-fns';

export const usePlantingHarvestingSchedule = (farmId = null) => {
  const [scheduleData, setScheduleData] = useState({
    farm_id: farmId,
    farm_name: '',
    activity_type: 'planting', // Default to planting
    scheduled_date: null,
    expected_completion_date: null,
    notes: ''
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch schedules when the component mounts or when farmId changes
  useEffect(() => {
    fetchSchedules();
  }, [farmId]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('planting_harvesting_schedule')
        .select('*')
        .order('scheduled_date', { ascending: true });
      
      // Filter by farm_id if provided
      if (farmId) {
        query = query.eq('farm_id', farmId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching schedules:', error);
        setError(error.message);
        return;
      }
      
      setSchedules(data || []);
    } catch (err) {
      console.error('Unexpected error fetching schedules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!scheduleData.activity_type || !scheduleData.scheduled_date || !scheduleData.farm_name) {
        const errorMessage = "Please fill in all required fields: activity type, scheduled date, and farm name";
        setError(errorMessage);
        showErrorToast(toast, errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Format dates if they exist
      const dataToSubmit = {
        ...scheduleData,
        scheduled_date: scheduleData.scheduled_date,
        expected_completion_date: scheduleData.expected_completion_date || null
      };
      
      // Insert data into the planting_harvesting_schedule table
      const { data, error } = await supabase
        .from('planting_harvesting_schedule')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        console.error('Error saving schedule:', error);
        setError(error.message);
        showErrorToast(toast, `Failed to save schedule: ${error.message}`);
        return { success: false, error };
      }
      
      // Show success toast and refresh schedules
      showSuccessToast(toast, `${scheduleData.activity_type.charAt(0).toUpperCase() + scheduleData.activity_type.slice(1)} schedule saved successfully`);
      
      // Reset form after successful insert
      setScheduleData({
        farm_id: farmId,
        farm_name: '',
        activity_type: 'planting',
        scheduled_date: null,
        expected_completion_date: null,
        notes: ''
      });
      
      // Refresh schedules list
      await fetchSchedules();
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Unexpected error saving schedule:', err);
      setError(err.message);
      showErrorToast(toast, `Failed to save schedule: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setScheduleData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSelectChange = (name, value) => {
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to populate form with farm name when farm is selected
  const setFarmName = (name) => {
    setScheduleData(prev => ({
      ...prev,
      farm_name: name
    }));
  };

  return {
    scheduleData,
    schedules,
    loading,
    saving,
    error,
    setScheduleData,
    handleInputChange,
    handleDateChange,
    handleSelectChange,
    setFarmName,
    saveSchedule,
    fetchSchedules
  };
};
