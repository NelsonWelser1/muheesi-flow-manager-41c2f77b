
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useCoffeeStockData = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCoffeeStockData = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Query the coffee stock data table
      let query = supabase
        .from('coffee_stock')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Apply time range filter if provided
      if (filters.timeRange && filters.timeRange !== 'all') {
        const timeMap = {
          'hour': 1/24,
          'day': 1,
          'week': 7,
          'month': 30,
          'year': 365
        };
        
        if (timeMap[filters.timeRange]) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - timeMap[filters.timeRange]);
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      // Apply status filter if provided
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply location filter if provided
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      // Apply search filter if provided - using individual filters instead of OR
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.trim();
        // Apply search to all fields individually
        query = query.or(
          `coffee_type.ilike.%${searchTerm}%,` +
          `quality_grade.ilike.%${searchTerm}%,` +
          `location.ilike.%${searchTerm}%,` +
          `manager.ilike.%${searchTerm}%`
        );
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setStockData(data || []);
      console.log('Fetched coffee stock data:', data);
      return data;
    } catch (err) {
      console.error('Error fetching coffee stock data:', err);
      setError(err);
      toast({
        title: "Error fetching coffee stock data",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCoffeeStockData();
  }, []);

  return {
    stockData,
    isLoading,
    error,
    fetchCoffeeStockData
  };
};

export default useCoffeeStockData;
