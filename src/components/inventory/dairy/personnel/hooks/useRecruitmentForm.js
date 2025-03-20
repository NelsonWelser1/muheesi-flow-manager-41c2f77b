
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useRecruitmentForm = (toast) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching recruitment records...');
      const { data, error } = await supabase
        .from('personnel_recruitment_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      console.log('Fetched recruitment records:', data);
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching recruitment records:', error);
      showErrorToast(toast, "Failed to load recruitment records");
    } finally {
      setIsLoading(false);
    }
  };

  const submitRecruitmentRecord = async (data) => {
    console.log('Recruitment data submitted:', data);
    
    setIsSubmitting(true);
    try {
      // Format the data for database insertion
      const formattedData = {
        candidate_name: data.candidateName || '',
        job_title: data.jobTitle || '',
        interview_date_time: data.interviewDateTime || null,
        hiring_manager_id: data.hiringManagerId || '',
        feedback: data.feedback || '',
        status: 'Pending'
      };

      console.log('Submitting recruitment data to Supabase:', formattedData);

      // Insert the data into Supabase
      const { data: result, error } = await supabase
        .from('personnel_recruitment_records')
        .insert([formattedData])
        .select();

      if (error) {
        console.error('Error inserting recruitment record:', error);
        throw error;
      }

      console.log('Recruitment record submission result:', result);
      showSuccessToast(toast, "Recruitment record has been saved successfully");
      
      // Refresh the records list
      await fetchRecords();
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving recruitment record:', error);
      showErrorToast(toast, "Failed to save recruitment record: " + (error.message || "Unknown error"));
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isLoading,
    records,
    submitRecruitmentRecord,
    fetchRecords
  };
};
