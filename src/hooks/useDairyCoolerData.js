import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useDairyCoolerData = () => {
  return useQuery({
    queryKey: ['dairyCoolerData'],
    queryFn: async () => {
      console.log('Fetching dairy cooler data using Supabase client');
      const { data, error } = await supabase
        .from('dairy_cooler_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dairy cooler data:', error);
        throw error;
      }

      console.log('Successfully fetched dairy cooler data:', data);
      return data;
    },
  });
};