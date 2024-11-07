import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useFreshecoFarming = (id) => useQuery({
    queryKey: ['freshecoFarming', id],
    queryFn: () => fromSupabase(supabase.from('Fresheco Farming Limited').select('*').eq('id', id).single()),
});

export const useFreshecoFarmings = () => useQuery({
    queryKey: ['freshecoFarming'],
    queryFn: () => fromSupabase(supabase.from('Fresheco Farming Limited').select('*')),
});

export const useFreshecoInventory = () => useQuery({
    queryKey: ['freshecoInventory'],
    queryFn: () => fromSupabase(supabase.from('fresheco_inventory').select('*')),
});

export const useFreshecoExports = () => useQuery({
    queryKey: ['freshecoExports'],
    queryFn: () => fromSupabase(supabase.from('fresheco_exports').select('*')),
});

export const useAddFreshecoInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newInventory) => fromSupabase(supabase.from('fresheco_inventory').insert([newInventory])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoInventory'] });
        },
    });
};

export const useAddFreshecoFarming = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFarming) => fromSupabase(supabase.from('Fresheco Farming Limited').insert([newFarming])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoFarming'] });
        },
    });
};

export const useUpdateFreshecoFarming = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('Fresheco Farming Limited').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoFarming'] });
        },
    });
};

export const useDeleteFreshecoFarming = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Fresheco Farming Limited').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['freshecoFarming'] });
        },
    });
};