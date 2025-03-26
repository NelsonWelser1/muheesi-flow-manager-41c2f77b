
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
      // Query the coffee_stock table - this table is used by ReceiveNewStock component
      let query = supabase
        .from('coffee_stock')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
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
      
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.location && filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      
      if (filters.coffeeType && filters.coffeeType !== 'all') {
        query = query.eq('coffee_type', filters.coffeeType);
      }
      
      if (filters.searchTerm) {
        query = query.or(`
          coffee_type.ilike.%${filters.searchTerm}%,
          quality_grade.ilike.%${filters.searchTerm}%,
          location.ilike.%${filters.searchTerm}%,
          manager.ilike.%${filters.searchTerm}%
        `);
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
      setError(err.message);
      toast({
        title: "Error fetching data",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Prevent effect from creating an endless loop
  useEffect(() => {
    // Initial fetch only, without depending on changing filters
    fetchCoffeeStockData();
    // Empty dependency array means this runs once on mount
  }, []);

  return {
    stockData,
    isLoading,
    error,
    fetchCoffeeStockData,
    refresh: () => fetchCoffeeStockData()
  };
};

export default useCoffeeStockData;
