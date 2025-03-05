
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useCRMReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch CRM reports from Supabase
  const fetchReports = async () => {
    console.log('Fetching CRM reports...');
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('CRM reports fetched:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching CRM reports:', error);
      showErrorToast(toast, "Failed to load CRM reports: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Handle form submission
  const submitCRMReport = async (reportData) => {
    console.log('Submitting CRM report:', reportData);
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        ...reportData,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null,
        created_by_name: userData?.user?.user_metadata?.full_name || userData?.user?.email || 'Anonymous User'
      };

      const { error } = await supabase
        .from('crm_reports')
        .insert([formattedData]);

      if (error) throw error;
      
      showSuccessToast(toast, "CRM report created successfully");
      fetchReports(); // Refresh the reports list
      return true;
    } catch (error) {
      console.error('Error creating CRM report:', error);
      showErrorToast(toast, "Failed to create CRM report: " + error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log form data
  const debugFormData = (formData) => {
    console.log('Debug - CRM Report Form Data:', formData);
    return formData;
  };

  return {
    reports,
    isLoading,
    isSubmitting,
    fetchReports,
    submitCRMReport,
    debugFormData
  };
};
