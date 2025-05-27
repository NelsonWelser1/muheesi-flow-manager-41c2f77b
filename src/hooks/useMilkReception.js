
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['milk-reception'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milk_reception')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    data,
    isLoading,
    error
  };
};
