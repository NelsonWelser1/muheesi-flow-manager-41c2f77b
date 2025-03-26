
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useAssociationsData = () => {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchAssociations = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Query the associations table
      let query = supabase
        .from('associations')
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
          query = query.or(`association_name.ilike.%${searchTerm}%,registration_number.ilike.%${searchTerm}%,association_type.ilike.%${searchTerm}%,coffee_types.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
        }
      }
      
      if (filters.associationType && filters.associationType !== 'all') {
        query = query.eq('association_type', filters.associationType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Ensure we don't have any undefined or null items
      const validData = (data || []).filter(item => item !== null && item !== undefined);
      
      // Add default properties to prevent "x is undefined" errors
      const processedData = validData.map(item => ({
        id: item.id || `assoc-${Math.random().toString(36).substring(2, 9)}`,
        name: item.association_name || 'Unnamed Association',
        association_name: item.association_name || 'Unnamed Association',
        registration_number: item.registration_number || 'N/A',
        association_type: item.association_type || 'Unknown Type',
        coffee_types: item.coffee_types || 'Unknown',
        location: item.location || 'Unknown Location',
        members_count: item.members_count || 0,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || item.created_at || new Date().toISOString(),
        ...item  // Keep all original properties
      }));
      
      setAssociations(processedData);
      console.log('Fetched associations data:', processedData);
      return processedData;
    } catch (err) {
      console.error('Error fetching associations:', err);
      setError(err.message);
      toast({
        title: "Error fetching associations",
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
    fetchAssociations();
  }, []);

  return {
    associations,
    loading,
    error,
    fetchAssociations,
    refresh: () => fetchAssociations()
  };
};

export default useAssociationsData;
