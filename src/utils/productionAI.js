import { supabase } from '@/integrations/supabase/supabase';

export const predictProduction = async (historicalData) => {
  console.log('Analyzing historical data for production predictions');
  try {
    const { data: productionHistory } = await supabase
      .from('cheese_production')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    // Simple prediction based on moving average
    const averageProduction = productionHistory.reduce((acc, curr) => 
      acc + (curr.yield_amount || 0), 0) / productionHistory.length;

    // Factor in seasonality (example: 10% increase during holiday seasons)
    const currentMonth = new Date().getMonth();
    const seasonalFactor = [1.1, 1.0, 1.0, 1.0, 1.05, 1.1, 1.15, 1.1, 1.0, 1.05, 1.1, 1.2][currentMonth];

    return {
      predictedOutput: averageProduction * seasonalFactor,
      confidence: 0.85,
      seasonalTrend: seasonalFactor > 1 ? 'increasing' : 'stable'
    };
  } catch (error) {
    console.error('Error predicting production:', error);
    throw error;
  }
};