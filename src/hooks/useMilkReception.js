import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

export const useMilkReception = () => {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();
  console.log('Initializing useMilkReception hook');

  const { data, isLoading, error } = useQuery({
    queryKey: ['milkReception'],
    queryFn: async () => {
      console.log('Fetching milk reception data');
      if (!session?.user) {
        console.log('No authenticated user found');
        return { data: [] };
      }

      const { data, error } = await supabase
        .from('milk_reception')
        .select('*')
        .order('datetime', { ascending: false });

      if (error) {
        console.error('Error fetching milk reception data:', error);
        throw error;
      }

      console.log('Fetched milk reception data:', data);
      return { data };
    },
    enabled: !!session?.user
  });

  const addMilkReception = useMutation({
    mutationFn: async (newReception) => {
      console.log('Adding new milk reception:', newReception);
      if (!session?.user) {
        throw new Error('User must be authenticated to add milk reception data');
      }

      const { data: insertedData, error } = await supabase
        .from('milk_reception')
        .insert([{
          ...newReception,
          user_id: session.user.id
        }])
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
      queryClient.invalidateQueries(['milkReception']);
    }
  });

  return {
    data: data || { data: [] },
    isLoading,
    error,
    addMilkReception
  };
};