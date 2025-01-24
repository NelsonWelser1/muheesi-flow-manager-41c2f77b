import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();

  const fetchMilkReception = async () => {
    console.log('Fetching milk reception data');
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
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
    return data;
  };

  const addMilkReception = async (newData) => {
    console.log('Adding new milk reception data:', newData);
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('milk_reception')
      .insert([{
        ...newData,
        user_id: session.session.user.id
      }])
      .select();

    if (error) {
      console.error('Error adding milk reception data:', error);
      throw error;
    }

    console.log('Successfully added milk reception data:', data);
    return data;
  };

  return {
    data: useQuery({
      queryKey: ['milkReception'],
      queryFn: fetchMilkReception,
    }),
    addMilkReception: useMutation({
      mutationFn: addMilkReception,
      onSuccess: () => {
        queryClient.invalidateQueries(['milkReception']);
      },
    }),
  };
};