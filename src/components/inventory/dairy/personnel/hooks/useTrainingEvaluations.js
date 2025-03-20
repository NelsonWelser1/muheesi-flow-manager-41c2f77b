
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useTrainingEvaluations = (toast) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState([]);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
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
    }
  };

  const submitTrainingEvaluation = async (data) => {
    console.log('Training evaluation data submitted:', data);
    
    setIsSubmitting(true);
    try {
      // Formatting the data properly for database insertion
      const formattedData = {
        employee_id: data.employeeId,
        training_module: data.trainingModule,
        training_date: data.trainingDate,
        performance_rating: parseInt(data.performanceRating) || null,
        feedback: data.feedback || null
        // operator_id is optional since authentication is disabled temporarily
      };

      // Log the actual data being sent to Supabase
      console.log('Submitting training data to Supabase:', formattedData);

      // First, attempt to insert directly
      const { data: result, error } = await supabase
        .from('personnel_training_evaluations')
        .insert([formattedData])
        .select(); // Added .select() to return the inserted row

      // Handle foreign key constraint errors specifically
      if (error) {
        console.error('Error inserting training evaluation:', error);
        
        if (error.code === '23503' && error.message.includes('personnel_training_evaluations_employee_id_fkey')) {
          console.warn('Warning: Employee ID does not exist in personnel_employee_records, using bypass procedure');
          
          // Use the stored procedure to bypass foreign key constraints during development
          const { data: rpcResult, error: rpcError } = await supabase.rpc('insert_training_evaluation', {
            p_employee_id: formattedData.employee_id,
            p_training_module: formattedData.training_module,
            p_training_date: formattedData.training_date,
            p_performance_rating: formattedData.performance_rating,
            p_feedback: formattedData.feedback
          });
          
          if (rpcError) {
            console.error('Error in RPC insert:', rpcError);
            throw rpcError;
          }
          
          showSuccessToast(toast, "Training evaluation saved (Note: Employee ID not found in system)");
          await fetchRecords(); // Refresh the list
          return { success: true };
        }
        throw error;
      }

      console.log('Training evaluation submission result:', result);
      showSuccessToast(toast, "Training evaluation has been saved successfully");
      await fetchRecords(); // Refresh the list
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
    records,
    submitTrainingEvaluation,
    fetchRecords
  };
};
