
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
      
      // Apply search filter if provided - using proper OR filter syntax
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.trim();
        if (searchTerm) {
          query = query.or(`coffee_type.ilike.%${searchTerm}%,quality_grade.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,manager.ilike.%${searchTerm}%`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Ensure we don't have any undefined or null items
      const validData = (data || []).filter(item => item !== null && item !== undefined);
      
      // Add default properties to prevent "x is undefined" errors
      const processedData = validData.map(item => ({
        id: item.id || `item-${Math.random().toString(36).substring(2, 9)}`,
        name: item.name || item.coffee_type || 'Unnamed Coffee',
        type: item.coffee_type || item.type || 'Unknown Type',
        grade: item.quality_grade || item.grade || 'N/A',
        location: item.location || 'Unknown Location',
        current_stock: item.current_stock || item.quantity || 0,
        max_capacity: item.max_capacity || 1000,
        health: item.health || 'good',
        trend: item.trend || 'stable',
        status: item.status || 'in_stock',
        manager: item.manager || 'N/A',
        updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        created_at: item.created_at || new Date().toISOString(),
        ...item  // Keep all original properties
      }));
      
      setStockData(processedData);
      console.log('Fetched coffee stock data:', processedData);
      return processedData;
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

  // Add mock location and historical data for charts
  const locationData = [
    {
      name: 'Kampala Store',
      stockLevel: 2100,
      maxCapacity: 3000,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: 'JBER',
      stockLevel: 1200,
      maxCapacity: 2500,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: 'Mbarara Warehouse',
      stockLevel: 950,
      maxCapacity: 1800,
      stockTypes: ['Arabica', 'Robusta']
    },
    {
      name: 'Kakyinga Factory',
      stockLevel: 750,
      maxCapacity: 1000,
      stockTypes: ['Robusta']
    }
  ];
  
  const historicalData = [
    { month: 'Jan', arabica: 300, robusta: 400 },
    { month: 'Feb', arabica: 500, robusta: 700 },
    { month: 'Mar', arabica: 700, robusta: 600 },
    { month: 'Apr', arabica: 900, robusta: 800 },
    { month: 'May', arabica: 1500, robusta: 1000 },
    { month: 'Jun', arabica: 1200, robusta: 1100 }
  ];

  // Initial fetch on mount
  useEffect(() => {
    fetchCoffeeStockData();
  }, []);

  return {
    stockData,
    locationData,
    historicalData,
    isLoading,
    error,
    fetchCoffeeStockData
  };
};

export default useCoffeeStockData;
