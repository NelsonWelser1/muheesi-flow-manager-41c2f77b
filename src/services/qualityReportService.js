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
        temperature: reportData.temperature ? parseFloat(reportData.temperature) : null,
        density: reportData.density ? parseFloat(reportData.density) : null,
        fat_content: reportData.fatContent ? parseFloat(reportData.fatContent) : null,
        texture_score: parseInt(reportData.textureScore),
        flavor_score: parseInt(reportData.flavorScore),
        texture_type: reportData.textureType,
        flavor_profile: reportData.flavorProfile,
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

export const fetchQualityReports = async ({ timeRange = '7d' } = {}) => {
  console.log('Fetching quality reports with timeRange:', timeRange);
  
  try {
    let query = supabase
      .from('quality_reports')
      .select('*')
      .order('test_date', { ascending: false });

    // Add time range filter if specified
    if (timeRange) {
      const now = new Date();
      const past = new Date();
      switch (timeRange) {
        case '7d':
          past.setDate(past.getDate() - 7);
          break;
        case '30d':
          past.setDate(past.getDate() - 30);
          break;
        case '90d':
          past.setDate(past.getDate() - 90);
          break;
        default:
          break;
      }
      query = query.gte('test_date', past.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    console.log('Quality reports fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching quality reports:', error);
    throw error;
  }
};