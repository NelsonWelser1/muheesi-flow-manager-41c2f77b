
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useSubmitReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = async (reportData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting report data:', reportData);
      
      // First, save report configuration
      const { data: configData, error: configError } = await supabase
        .from('report_configurations')
        .insert([{
          report_type: reportData.type,
          start_date: reportData.startDate,
          end_date: reportData.endDate,
          user_id: null // Setting to null since authentication is temporarily disabled
        }])
        .select();

      if (configError) {
        console.error('Error saving report configuration:', configError);
        throw configError;
      }

      console.log('Report configuration saved:', configData);

      // Then save the maintenance report
      const { data: reportResult, error: reportError } = await supabase
        .from('maintenance_reports')
        .insert([{
          title: reportData.title,
          type: reportData.type,
          content: reportData.content,
          recipient_name: reportData.recipient.name,
          recipient_email: reportData.recipient.email,
          recipient_phone: reportData.recipient.phone,
          send_via: reportData.sendVia,
          start_date: reportData.startDate,
          end_date: reportData.endDate,
          user_id: null // Setting to null since authentication is temporarily disabled
        }])
        .select();

      if (reportError) {
        console.error('Error saving report:', reportError);
        throw reportError;
      }

      console.log('Report submitted successfully:', reportResult);
      return reportResult;
      
    } catch (error) {
      console.error('Error in report submission:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting
  };
};
