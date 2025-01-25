import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();
  console.log('Initializing useMilkReception hook');

  const fetchMilkReception = async () => {
    console.log('Fetching milk reception data');
    const { data, error } = await supabase
      .from('milk_reception')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching milk reception data:', error);
      throw error;
    }

    console.log('Successfully fetched milk reception data:', data);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['milkReception'],
    queryFn: fetchMilkReception,
  });

  const addMilkReception = useMutation({
    mutationFn: async (newData) => {
      console.log('Adding new milk reception data:', newData);
      const { data: result, error } = await supabase
        .from('milk_reception')
        .insert([newData])
        .select()
        .single();

      if (error) {
        console.error('Error adding milk reception data:', error);
        throw error;
      }

      console.log('Successfully added milk reception data:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milkReception']);
    },
  });

  return {
    data,
    isLoading,
    error,
    addMilkReception,
  };
};