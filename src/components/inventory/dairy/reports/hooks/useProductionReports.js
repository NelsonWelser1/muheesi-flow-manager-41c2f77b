
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/components/ui/notifications";

export const useProductionReports = () => {
  const [reports, setReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to fetch reports from Supabase
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching production reports...');
      
      const { data, error } = await supabase
        .from('dairy_production_reports')
        .select('*')
        .order('production_date', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched production reports:', data);
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching production reports:', err);
      setError(err);
      showErrorToast(toast, `Failed to load production reports: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to submit a new report to Supabase
  const submitReport = async (reportData) => {
    setIsSubmitting(true);
    try {
      // Input validation
      if (!reportData.productType) throw new Error('Product type is required');
      if (!reportData.batchId) throw new Error('Batch ID is required');
      if (!reportData.rawMaterial) throw new Error('Raw material amount is required');
      if (!reportData.finishedProduct) throw new Error('Finished product amount is required');
      if (!reportData.productionDate) throw new Error('Production date is required');
      
      // Log the data we're about to submit
      console.log('Submitting production report:', reportData);
      
      // Prepare data for insertion
      const insertData = {
        product_type: reportData.productType,
        batch_id: reportData.batchId,
        raw_material: parseFloat(reportData.rawMaterial) || 0,
        finished_product: parseFloat(reportData.finishedProduct) || 0,
        production_date: reportData.productionDate,
        efficiency: parseInt(reportData.efficiency) || 0,
        quality_score: parseInt(reportData.qualityScore) || 0,
        notes: reportData.notes || '',
        operator_id: null // No authentication for now
      };
      
      // Insert the data into Supabase
      const { data, error } = await supabase
        .from('dairy_production_reports')
        .insert([insertData])
        .select();
      
      if (error) throw error;
      
      console.log('Report submitted successfully:', data);
      showSuccessToast(toast, 'Production report submitted successfully!');
      
      // Refresh the reports list
      await fetchReports();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting report:', error);
      showErrorToast(toast, `Failed to submit report: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a report
  const deleteReport = async (reportId) => {
    try {
      showInfoToast(toast, 'Deleting report...');
      
      const { error } = await supabase
        .from('dairy_production_reports')
        .delete()
        .eq('id', reportId);
      
      if (error) throw error;
      
      showSuccessToast(toast, 'Report deleted successfully!');
      
      // Refresh the reports list
      await fetchReports();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting report:', error);
      showErrorToast(toast, `Failed to delete report: ${error.message}`);
      return { success: false, error };
    }
  };

  return {
    reports,
    isLoading,
    isSubmitting,
    error,
    submitReport,
    deleteReport,
    refreshReports: fetchReports
  };
};
