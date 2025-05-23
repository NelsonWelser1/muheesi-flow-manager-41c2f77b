
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useFarmData = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchFarmData = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the farm_information table
      let query = supabase
        .from('farm_information')
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
      
      // Apply search filter if provided
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.trim();
        if (searchTerm) {
          query = query.or(`farm_name.ilike.%${searchTerm}%,manager_name.ilike.%${searchTerm}%,supervisor_name.ilike.%${searchTerm}%,coffee_type.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
        }
      }
      
      // Apply coffee type filter if provided
      if (filters.coffeeType) {
        query = query.eq('coffee_type', filters.coffeeType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Ensure we don't have any undefined or null items
      const validData = (data || []).filter(item => item !== null && item !== undefined);
      
      // Add default properties to prevent "x is undefined" errors
      const processedData = validData.map(item => ({
        id: item.id || `farm-${Math.random().toString(36).substring(2, 9)}`,
        name: item.farm_name || 'Unnamed Farm',
        farm_name: item.farm_name || 'Unnamed Farm',
        manager_name: item.manager_name || 'N/A',
        supervisor_name: item.supervisor_name || 'N/A',
        coffee_type: item.coffee_type || 'Unknown Type',
        location: item.location || 'Unknown Location',
        acres: item.acres || 0,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        ...item  // Keep all original properties
      }));
      
      setFarms(processedData);
      console.log('Fetched farm data:', processedData);
      return processedData;
    } catch (err) {
      console.error('Error fetching farm data:', err);
      setError(err.message);
      toast({
        title: "Error fetching farm data",
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
    fetchFarmData();
  }, []);

  return {
    farms,
    loading,
    error,
    fetchFarmData,
    refresh: () => fetchFarmData()
  };
};

export default useFarmData;
