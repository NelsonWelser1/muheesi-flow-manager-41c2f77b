
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: 'all',
    status: 'all',
    searchTerm: ''
  });

  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the coffee_stock_transfers table
      let query = supabase
        .from('coffee_stock_transfers')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply time range filter
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
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply search filter
      if (filters.searchTerm) {
        query = query.or(`
          coffee_type.ilike.%${filters.searchTerm}%,
          quality_grade.ilike.%${filters.searchTerm}%,
          source_location.ilike.%${filters.searchTerm}%,
          destination_location.ilike.%${filters.searchTerm}%,
          manager.ilike.%${filters.searchTerm}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setTransfers(data || []);
      console.log('Fetched coffee transfers data:', data);
      return data;
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update filters and fetch data
  const handleTimeRangeChange = (timeRange) => {
    setFilters(prev => ({ ...prev, timeRange }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleRefresh = () => {
    fetchTransfers();
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchTransfers();
  }, [filters]);

  return {
    transfers,
    loading,
    error,
    filters,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh
  };
};

export default useCoffeeStockTransfers;
