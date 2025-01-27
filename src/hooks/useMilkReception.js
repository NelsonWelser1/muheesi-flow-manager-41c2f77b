import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();

  const fetchMilkReceptions = async () => {
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
    return data;
  };

  const addMilkReception = useMutation({
    mutationFn: async (newReception) => {
      console.log('Adding new milk reception:', newReception);
      
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milkReceptions']);
    },
  });

  const { data: receptions, isLoading } = useQuery({
    queryKey: ['milkReceptions'],
    queryFn: fetchMilkReceptions,
  });

  return {
    receptions,
    isLoading,
    addMilkReception,
  };
};