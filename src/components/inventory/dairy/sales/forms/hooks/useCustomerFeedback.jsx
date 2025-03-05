
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useCustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch feedback data on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching customer feedback data...");
      const { data, error } = await supabase
        .from('customer_feedback')
        .select('*')
        .order('feedback_date', { ascending: false });

      if (error) {
        console.error("Error fetching feedback:", error);
        throw error;
      }

      console.log("Feedback data retrieved:", data);
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
      showErrorToast(toast, "Failed to load customer feedback: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting feedback data:", formData);
      
      // Format the data for submission
      const formattedData = {
        customer_name: formData.customer_name || '',
        customer_email: formData.customer_email || '',
        customer_phone: formData.customer_phone || '',
        product_service: formData.product_service || '',
        satisfaction_rating: parseInt(formData.satisfaction_rating) || 3,
        feedback_text: formData.feedback_text || '',
        improvement_suggestions: formData.improvement_suggestions || '',
        follow_up_required: formData.follow_up_required || false,
        follow_up_status: formData.follow_up_required ? formData.follow_up_status : null,
        feedback_date: new Date().toISOString()
        // Note: created_by is commented out since auth is temporarily disabled
        // created_by: userData?.user?.id || null
      };

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('customer_feedback')
        .insert([formattedData]);

      if (error) {
        console.error("Error submitting feedback:", error);
        throw error;
      }

      console.log("Feedback submitted successfully:", data);
      showSuccessToast(toast, "Feedback submitted successfully");
      
      // Refresh the feedback list
      fetchFeedbacks();
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showErrorToast(toast, "Failed to submit feedback: " + error.message);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log current feedback data
  const debugFeedback = (formData) => {
    console.log("Current feedback form data:", formData);
    return formData;
  };

  return {
    feedbacks,
    isLoading,
    isSubmitting,
    submitFeedback,
    fetchFeedbacks,
    debugFeedback
  };
};

export default useCustomerFeedback;
