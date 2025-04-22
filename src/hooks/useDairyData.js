import { useState, useEffect } from 'react';
import { useBukomeroDairyData } from './useBukomeroDairyData';

export const useDairyData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { farmMetrics, isLoading: metricsLoading, error: metricsError, refreshMetrics } = useBukomeroDairyData();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Sample data structure - in a real app, this would come from an API or database
        // For now, we'll use the farmMetrics data from useBukomeroDairyData hook
        if (farmMetrics) {
          // Map farm metrics to the expected data structure
          setData({
            todayCollection: 2450,
            collectionTrend: 3.2,
            activeProducers: 48,
            newProducers: 5,
            processingOutput: 1200,
            outputTrend: 1.8,
            // Other metrics from farmMetrics
            ...farmMetrics
          });
        }
        
      } catch (err) {
        console.error('Error in useDairyData:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmMetrics]);

  return {
    data,
    isLoading: isLoading || metricsLoading,
    error: error || metricsError,
    refreshData: refreshMetrics
  };
};
