
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useCoffeeStockTransfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTransfers = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the coffee_stock_transfers table
      let query = supabase
        .from('coffee_stock_transfers')
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
        query = query.or(`source_location.ilike.%${filters.location}%,destination_location.ilike.%${filters.location}%`);
      }
      
      // Apply search filter if provided - using individual filters instead of OR
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.trim();
        // Apply search to all fields individually
        query = query.or(
          `coffee_type.ilike.%${searchTerm}%,` +
          `quality_grade.ilike.%${searchTerm}%,` +
          `source_location.ilike.%${searchTerm}%,` +
          `destination_location.ilike.%${searchTerm}%,` +
          `manager.ilike.%${searchTerm}%`
        );
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
      setError(err);
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

  // Initial fetch on mount
  useEffect(() => {
    fetchTransfers();
  }, []);

  return {
    transfers,
    loading,
    error,
    fetchTransfers
  };
};

export default useCoffeeStockTransfers;
