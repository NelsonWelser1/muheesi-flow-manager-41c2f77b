import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Fresheco Farming Limited

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | bigint    | true     |
| created_at | timestamp with time zone | timestamp | true     |
| tittle     | string                  | text      | false    |
| content    | string                  | text      | false    |
| color      | string                  | text      | false    |

Description: Fresh and Dry export based business
*/

export const useFreshecoFarming = (id) => useQuery({
    queryKey: ['freshecoFarming', id],
    queryFn: () => fromSupabase(supabase.from('Fresheco Farming Limited').select('*').eq('id', id).single()),
});

export const useFreshecoFarmings = () => useQuery({
    queryKey: ['freshecoFarming'],
    queryFn: () => fromSupabase(supabase.from('Fresheco Farming Limited').select('*')),
});

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