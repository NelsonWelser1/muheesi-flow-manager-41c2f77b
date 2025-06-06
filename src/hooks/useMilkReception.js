
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export const useMilkReception = () => {
  const queryClient = useQueryClient();

  // Fetch all milk reception records
  const fetchMilkReceptions = async () => {
    console.log('Fetching milk reception data');
    try {
      const { data, error, status } = await supabase
        .from('milk_reception')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && status !== 406) {
        console.error('Error fetching milk reception data:', error);
        throw error;
      }

      console.log('Fetched milk reception data:', data);
      return data || [];
    } catch (error) {
      console.error('Error in fetchMilkReceptions:', error);
      throw error;
    }
  };

  // Add new milk reception record
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
      queryClient.invalidateQueries({ queryKey: ['milkReceptions'] });
    }
  });

  // Add new milk tank offload record
  const addMilkTankOffload = useMutation({
    mutationFn: async (newOffload) => {
      console.log('Adding new milk tank offload:', newOffload);
      try {
        const { data, error } = await supabase
          .from('milk_tank_offloads')
          .insert([newOffload])
          .select()
          .single();

        if (error) {
          console.error('Error inserting milk tank offload:', error);
          throw error;
        }

        console.log('Successfully added milk tank offload:', data);
        return data;
      } catch (error) {
        console.error('Error in addMilkTankOffload:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milkReceptions'] });
    }
  });

  const query = useQuery({
    queryKey: ['milkReceptions'],
    queryFn: fetchMilkReceptions,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Query error:', error);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    refetchMilkReception: query.refetch, // Add this alias for compatibility
    addMilkReception,
    addMilkTankOffload
  };
};
