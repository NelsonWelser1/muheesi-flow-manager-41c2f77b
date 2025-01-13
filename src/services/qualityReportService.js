import { supabase } from '@/integrations/supabase/supabase';

export const submitQualityReport = async (reportData) => {
  console.log('Submitting quality report:', reportData);
  
  try {
    const { data, error } = await supabase
      .from('quality_reports')
      .insert([{
        batch_number: reportData.batchNumber,
        cheese_type: reportData.cheeseType,
        ph_level: parseFloat(reportData.pH),
        moisture_content: parseFloat(reportData.moisture),
        salt_content: parseFloat(reportData.saltContent),
        texture_score: parseInt(reportData.textureScore),
        flavor_score: parseInt(reportData.flavorScore),
        report_type: reportData.reportType,
        recipient_level: reportData.recipientLevel,
        notes: reportData.notes,
        test_date: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    console.log('Quality report submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error submitting quality report:', error);
    throw error;
  }
};