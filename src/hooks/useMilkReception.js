import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();
  console.log('Initializing useMilkReception hook');

  const { data, isLoading, error } = useQuery({
    queryKey: ['milkReception'],
    queryFn: async () => {
      console.log('Fetching milk reception data');
      const { data, error } = await supabase
        .from('milk_reception')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching milk reception data:', error);
        throw error;
      }

      console.log('Fetched milk reception data:', data);
      return { data };
    }
  });

  const addMilkReception = useMutation({
    mutationFn: async (newReception) => {
      console.log('Adding new milk reception:', newReception);
      const { data: insertedData, error } = await supabase
        .from('milk_reception')
        .insert([newReception])
        .select()
        .single();

      if (error) {
        console.error('Error adding milk reception:', error);
        throw error;
      }

      console.log('Successfully added milk reception:', insertedData);
      return insertedData;
    },
    onSuccess: () => {
      console.log('Invalidating milk reception queries');
      queryClient.invalidateQueries(['milkReception']);
    }
  });

  return {
    data: data?.data || [],
    isLoading,
    error,
    addMilkReception
  };
};