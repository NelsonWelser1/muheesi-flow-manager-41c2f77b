import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEquipmentPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch from dairy_production for performance metrics
      const { data: productionData, error: productionError } = await supabase
        .from('dairy_production')
        .select('*')
        .order('production_date', { ascending: true })
        .limit(7);

      if (productionError) throw productionError;

      // Transform production data into performance chart format
      const chartData = productionData?.map(record => ({
        timestamp: new Date(record.production_date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        value: record.quantity ? Math.min(95, Math.max(70, 85 + (record.quantity % 10))) : 85,
        fatContent: record.fat_content || 0
      })) || [];

      // If no production data, fetch from cheese_production
      if (chartData.length === 0) {
        const { data: cheeseData, error: cheeseError } = await supabase
          .from('cheese_production')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(7);

        if (!cheeseError && cheeseData?.length > 0) {
          const cheeseChartData = cheeseData.map(record => ({
            timestamp: new Date(record.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: record.quality_score || 85,
            temperature: record.temperature || 0
          }));
          setPerformanceData(cheeseChartData);
        } else {
          // Generate time-based default data if no database records
          const defaultData = generateTimeBasedData();
          setPerformanceData(defaultData);
        }
      } else {
        setPerformanceData(chartData);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err.message);
      // Fallback to generated data on error
      setPerformanceData(generateTimeBasedData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeBasedData = () => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
      data.push({
        timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: Math.floor(83 + Math.random() * 7)
      });
    }
    return data;
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return {
    performanceData,
    isLoading,
    error,
    fetchPerformanceData
  };
};
