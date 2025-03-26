
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
      
      // Apply filters if provided
      if (filters.searchTerm) {
        query = query.or(`
          farm_name.ilike.%${filters.searchTerm}%,
          manager_name.ilike.%${filters.searchTerm}%,
          supervisor_name.ilike.%${filters.searchTerm}%,
          coffee_type.ilike.%${filters.searchTerm}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setFarms(data || []);
      console.log('Fetched farm data:', data);
      return data;
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
