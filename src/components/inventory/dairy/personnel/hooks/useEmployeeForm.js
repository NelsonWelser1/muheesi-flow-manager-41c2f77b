
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useEmployeeForm = (toast) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState([]);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching employee records:', error);
      showErrorToast(toast, "Failed to load recent employee records");
    }
  };

  const submitEmployeeRecord = async (data) => {
    console.log('Form data submitted:', data);
    
    setIsSubmitting(true);
    try {
      // Formatting the data properly for database insertion
      // Remove 'department' from the data as it's not in the schema
      const formattedData = {
        employee_id: data.employeeId,
        job_title: data.jobTitle,
        shift_start: data.shiftStart,
        shift_end: data.shiftEnd,
        performance_rating: parseInt(data.performanceRating) || null,
        review_date_time: data.reviewDateTime,
        status: data.status || 'Active',
        comments: data.comments
      };

      // Log the actual data being sent to Supabase
      console.log('Submitting data to Supabase:', formattedData);

      const { data: result, error } = await supabase
        .from('personnel_employee_records')
        .insert([formattedData])
        .select();

      if (error) throw error;

      console.log('Submission result:', result);
      showSuccessToast(toast, "Employee record has been saved successfully");
      fetchRecords(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error saving employee record:', error);
      showErrorToast(toast, "Failed to save employee record: " + (error.message || "Unknown error"));
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    records,
    submitEmployeeRecord,
    fetchRecords
  };
};
