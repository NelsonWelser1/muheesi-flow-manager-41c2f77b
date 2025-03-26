
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
      
      // Apply filters if provided
      if (filters.searchTerm) {
        query = query.or(`
          association_name.ilike.%${filters.searchTerm}%,
          registration_number.ilike.%${filters.searchTerm}%,
          association_type.ilike.%${filters.searchTerm}%,
          coffee_types.ilike.%${filters.searchTerm}%
        `);
      }
      
      if (filters.associationType && filters.associationType !== 'all') {
        query = query.eq('association_type', filters.associationType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setAssociations(data || []);
      console.log('Fetched associations data:', data);
      return data;
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
