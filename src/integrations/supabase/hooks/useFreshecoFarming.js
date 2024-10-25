import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useFreshecoInventory = () => useQuery({
    queryKey: ['freshecoInventory'],
    queryFn: () => fromSupabase(supabase.from('fresheco_inventory').select('*')),
});

export const useFreshecoExports = () => useQuery({
    queryKey: ['freshecoExports'],
    queryFn: () => fromSupabase(supabase.from('fresheco_exports').select('*')),
});

export const useFreshecoQualityControl = () => useQuery({
    queryKey: ['freshecoQualityControl'],
    queryFn: () => fromSupabase(supabase.from('fresheco_quality_control').select('*')),
});

// Mutations
export const useAddFreshecoInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newInventory) => fromSupabase(supabase.from('fresheco_inventory').insert([newInventory])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoInventory'] });
        },
    });
};

export const useAddFreshecoExport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newExport) => fromSupabase(supabase.from('fresheco_exports').insert([newExport])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoExports'] });
        },
    });
};

export const useAddQualityControl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newQC) => fromSupabase(supabase.from('fresheco_quality_control').insert([newQC])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoQualityControl'] });
        },
    });
};