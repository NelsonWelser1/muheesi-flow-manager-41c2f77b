
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timeRange: 'all',
    status: 'all',
    searchTerm: ''
  });
  const { toast } = useToast();

  const fetchTransfers = async (customFilters = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use provided custom filters or default to component state filters
      const activeFilters = customFilters || filters;
      
      // Query the coffee_stock_transfers table
      let query = supabase
        .from('coffee_stock_transfers')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply time range filter
      if (activeFilters.timeRange && activeFilters.timeRange !== 'all') {
        const timeMap = {
          'hour': 1/24,
          'day': 1,
          'week': 7,
          'month': 30,
          'year': 365
        };
        
        if (timeMap[activeFilters.timeRange]) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - timeMap[activeFilters.timeRange]);
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      // Apply status filter
      if (activeFilters.status && activeFilters.status !== 'all') {
        query = query.eq('status', activeFilters.status);
      }
      
      // Apply location filter if provided
      if (activeFilters.location && activeFilters.location !== 'all') {
        query = query.eq('destination_location', activeFilters.location);
      }
      
      // Apply search filter
      if (activeFilters.searchTerm) {
        query = query.or(`
          coffee_type.ilike.%${activeFilters.searchTerm}%,
          quality_grade.ilike.%${activeFilters.searchTerm}%,
          source_location.ilike.%${activeFilters.searchTerm}%,
          destination_location.ilike.%${activeFilters.searchTerm}%,
          manager.ilike.%${activeFilters.searchTerm}%
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
      toast({
        title: "Error fetching transfers",
        description: err.message,
        variant: "destructive"
      });
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

  // Effect to fetch data when filters change - with proper dependency array
  useEffect(() => {
    fetchTransfers();
  }, [filters.timeRange, filters.status, filters.searchTerm]);

  // Initial fetch, only once on mount
  useEffect(() => {
    fetchTransfers();
  }, []);

  return {
    transfers,
    loading,
    error,
    filters,
    handleTimeRangeChange,
    handleStatusChange,
    handleSearch,
    handleRefresh,
    fetchTransfers
  };
};

export default useCoffeeStockTransfers;
