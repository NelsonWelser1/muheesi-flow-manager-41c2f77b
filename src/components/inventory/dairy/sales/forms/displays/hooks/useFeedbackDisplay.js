
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

export const useFeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomerFeedback();
  }, []);

  const fetchCustomerFeedback = async () => {
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

      console.log(`Retrieved ${data?.length || 0} feedback records`);
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
      showErrorToast(toast, "Failed to load customer feedback: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredFeedbacks = () => {
    if (activeTab === "all") return feedbacks;
    
    if (activeTab === "high") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating >= 4);
    } else if (activeTab === "medium") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating === 3);
    } else if (activeTab === "low") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating < 3);
    }
    
    return feedbacks;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return {
    feedbacks,
    isLoading,
    activeTab,
    setActiveTab,
    fetchCustomerFeedback,
    getFilteredFeedbacks,
    formatDate
  };
};

export default useFeedbackDisplay;
