
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export const useProduction = () => {
  const queryClient = useQueryClient();

  const addProduction = useMutation({
    mutationFn: async (productionData) => {
      console.log('Adding production data:', productionData);
      
      // Determine which table to use based on market type
      const tableName = productionData.market === 'international' ? 'production_line_international' : 'production_line_local';
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([productionData])
        .select()
        .single();

      if (error) {
        console.error('Error adding production:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] });
    }
  });

  return {
    addProduction
  };
};
