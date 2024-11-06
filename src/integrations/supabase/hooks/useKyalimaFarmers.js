import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Kyalima Farmers Limited

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | bigint    | true     |
| created_at | timestamp with time zone | timestamp | true     |

Description: Hold Assets, Buy Businesses, Partnerships, Seek Capital, run business, etc
*/

export const useKyalimaFarmer = (id) => useQuery({
    queryKey: ['kyalimaFarmers', id],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*').eq('id', id).single()),
});

export const useKyalimaFarmers = () => useQuery({
    queryKey: ['kyalimaFarmers'],
    queryFn: () => fromSupabase(supabase.from('Kyalima Farmers Limited').select('*')),
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