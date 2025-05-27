
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProduction = () => {
  const queryClient = useQueryClient();

  const addProduction = useMutation({
    mutationFn: async (productionData) => {
      const tableName = productionData.market === 'international' 
        ? 'production_line_international' 
        : 'production_line_local';
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([productionData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] });
    },
  });

  return {
    addProduction
  };
};
