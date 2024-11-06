import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Grand Berna Dairies

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | bigint    | true     |
| created_at | timestamp with time zone | timestamp | true     |

Description: Dairy Sector
*/

export const useGrandBernaDairy = (id) => useQuery({
    queryKey: ['grandBernaDairies', id],
    queryFn: () => fromSupabase(supabase.from('Grand Berna Dairies').select('*').eq('id', id).single()),
});

export const useGrandBernaDairies = () => useQuery({
    queryKey: ['grandBernaDairies'],
    queryFn: () => fromSupabase(supabase.from('Grand Berna Dairies').select('*')),
});

export const useAddGrandBernaDairy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDairy) => fromSupabase(supabase.from('Grand Berna Dairies').insert([newDairy])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grandBernaDairies'] });
        },
    });
};

export const useUpdateGrandBernaDairy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('Grand Berna Dairies').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grandBernaDairies'] });
        },
    });
};

export const useDeleteGrandBernaDairy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Grand Berna Dairies').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grandBernaDairies'] });
        },
    });
};