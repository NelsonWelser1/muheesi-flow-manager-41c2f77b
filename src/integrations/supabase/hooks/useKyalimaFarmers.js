import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useKyalimaFarmer = (id) => useQuery({
    queryKey: ['kyalimaFarmers', id],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*').eq('id', id).single()),
});

export const useKyalimaFarmers = () => useQuery({
    queryKey: ['kyalimaFarmers'],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*')),
});

export const useRiceImports = () => useQuery({
    queryKey: ['riceImports'],
    queryFn: () => fromSupabase(supabase.from('rice_imports').select('*')),
});

export const useBullFattening = () => useQuery({
    queryKey: ['bullFattening'],
    queryFn: () => fromSupabase(supabase.from('bull_fattening_program').select('*')),
});

export const useAddKyalimaFarmer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFarmer) => fromSupabase(supabase.from('Kyalima Farmers Limited').insert([newFarmer])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyalimaFarmers'] });
        },
    });
};

export const useUpdateKyalimaFarmer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('Kyalima Farmers Limited').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyalimaFarmers'] });
        },
    });
};

export const useDeleteKyalimaFarmer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Kyalima Farmers Limited').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyalimaFarmers'] });
        },
    });
};