
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useSubmitReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitReport = async (reportData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting report to Supabase:', reportData);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Add the report to dairy_production table
      const { data, error } = await supabase
        .from('dairy_production')
        .insert([{
          product_type: reportData.productType,
          batch_id: reportData.batchId,
          raw_material_used: parseFloat(reportData.rawMaterial),
          finished_product_amount: parseFloat(reportData.finishedProduct),
          production_date: reportData.productionDate,
          efficiency_percentage: parseInt(reportData.efficiency),
          quality_score: parseInt(reportData.qualityScore),
          operator_id: user?.id || null,
          notes: reportData.notes
        }])
        .select();
      
      if (error) throw error;
      
      console.log('Report submitted successfully:', data);
      showSuccessToast(toast, 'Production report submitted successfully!');
      
      // Create a notification for the report
      const { error: notificationError } = await supabase
        .from('dairy_notifications')
        .insert([{
          title: 'New Production Report',
          message: `A new ${reportData.productType} production report has been submitted.`,
          type: 'info',
          section_id: 'production',
          user_id: user?.id || null
        }]);
      
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't throw here, just log the error
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting report:', error);
      showErrorToast(toast, `Failed to submit report: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting
  };
};
