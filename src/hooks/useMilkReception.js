import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();

  const fetchMilkReceptions = async () => {
    console.log('Fetching milk reception data');
    try {
      const { data, error } = await supabase
        .from('milk_reception')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching milk reception data:', error);
        throw error;
      }

      console.log('Fetched milk reception data:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchMilkReceptions:', error);
      throw error;
    }
  };

  const addMilkReception = useMutation({
    mutationFn: async (newReception) => {
      console.log('Adding new milk reception:', newReception);
      try {
        const { data, error } = await supabase
          .from('milk_reception')
          .insert([newReception])
          .select()
          .single();

        if (error) {
          console.error('Error inserting milk reception:', error);
          throw error;
        }

        console.log('Successfully added milk reception:', data);
        return data;
      } catch (error) {
        console.error('Error in addMilkReception:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milkReceptions']);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const query = useQuery({
    queryKey: ['milkReceptions'],
    queryFn: fetchMilkReceptions,
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    addMilkReception
  };
};