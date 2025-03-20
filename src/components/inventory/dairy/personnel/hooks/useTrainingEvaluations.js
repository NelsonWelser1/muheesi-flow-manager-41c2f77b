
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useTrainingEvaluations = (toast) => {
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
      console.log('Fetching training evaluation records...');
      const { data, error } = await supabase
        .from('personnel_training_evaluations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      console.log('Fetched training records:', data);
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching training evaluations:', error);
      showErrorToast(toast, "Failed to load recent training records");
    } finally {
      setIsLoading(false);
    }
  };

  const submitTrainingEvaluation = async (data) => {
    console.log('Training evaluation data submitted:', data);
    
    setIsSubmitting(true);
    try {
      // Format the data for database insertion
      const formattedData = {
        employee_id: data.employeeId,
        training_module: data.trainingModule,
        training_date: data.trainingDate,
        performance_rating: parseInt(data.performanceRating) || null,
        feedback: data.feedback || null
      };

      console.log('Submitting training data to Supabase:', formattedData);

      // Insert the data into Supabase
      const { data: result, error } = await supabase
        .from('personnel_training_evaluations')
        .insert([formattedData])
        .select();

      if (error) {
        console.error('Error inserting training evaluation:', error);
        throw error;
      }

      console.log('Training evaluation submission result:', result);
      showSuccessToast(toast, "Training evaluation has been saved successfully");
      
      // Refresh the records list
      await fetchRecords();
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving training evaluation:', error);
      showErrorToast(toast, "Failed to save training evaluation: " + (error.message || "Unknown error"));
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isLoading,
    records,
    submitTrainingEvaluation,
    fetchRecords
  };
};
