
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { fromSupabase } from '../utils/supabaseUtils';

export const useFetchCattleFattening = (farmId = 'kyalima') => useQuery({
  queryKey: ['cattleFattening', farmId],
  queryFn: () => fromSupabase(
    supabase
      .from('cattle_fattening')
      .select('*')
      .eq('farm_id', farmId)
      .order('entry_date', { ascending: false })
  ),
});

export const useFetchCattleFatteningById = (cattleId) => useQuery({
  queryKey: ['cattleFattening', cattleId],
  queryFn: () => fromSupabase(
    supabase
      .from('cattle_fattening')
      .select('*')
      .eq('id', cattleId)
      .single()
  ),
  enabled: !!cattleId,
});

export const useAddCattleFattening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCattle) => fromSupabase(
      supabase
        .from('cattle_fattening')
        .insert([newCattle])
        .select()
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattleFattening'] });
    },
  });
};

export const useUpdateCattleFattening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(
      supabase
        .from('cattle_fattening')
        .update(updateData)
        .eq('id', id)
        .select()
    ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cattleFattening'] });
      queryClient.invalidateQueries({ queryKey: ['cattleFattening', variables.id] });
    },
  });
};

export const useDeleteCattleFattening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(
      supabase
        .from('cattle_fattening')
        .delete()
        .eq('id', id)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cattleFattening'] });
    },
  });
};

export const useCattleFatteningAnalytics = (farmId = 'kyalima') => useQuery({
  queryKey: ['cattleFatteningAnalytics', farmId],
  queryFn: () => fromSupabase(
    supabase
      .from('cattle_fattening_analytics')
      .select('*')
      .eq('farm_id', farmId)
  ),
});
