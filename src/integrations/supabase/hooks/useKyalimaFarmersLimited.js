import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useKyalimaFarmersLimited = (id) => useQuery({
    queryKey: ['KyalimaFarmersLimited', id],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*').eq('id', id).single()),
});

export const useKyalimaFarmersLimiteds = () => useQuery({
    queryKey: ['KyalimaFarmersLimited'],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*')),
});

export const useAddKyalimaFarmersLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFarmer) => fromSupabase(supabase.from('Kyalima Farmers Limited').insert([newFarmer])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KyalimaFarmersLimited'] });
        },
    });
};

export const useUpdateKyalimaFarmersLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('Kyalima Farmers Limited').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KyalimaFarmersLimited'] });
        },
    });
};

export const useDeleteKyalimaFarmersLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Kyalima Farmers Limited').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KyalimaFarmersLimited'] });
        },
    });
};