import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### KAJON Coffee Limited

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |

Note: This table doesn't have any foreign key relationships.
*/

export const useKAJONCoffeeLimited = (id) => useQuery({
    queryKey: ['KAJONCoffeeLimited', id],
    queryFn: () => fromSupabase(supabase.from('KAJON Coffee Limited').select('*').eq('id', id).single()),
});

export const useKAJONCoffeeLimiteds = () => useQuery({
    queryKey: ['KAJONCoffeeLimited'],
    queryFn: () => fromSupabase(supabase.from('KAJON Coffee Limited').select('*')),
});

export const useAddKAJONCoffeeLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCoffee) => fromSupabase(supabase.from('KAJON Coffee Limited').insert([newCoffee])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KAJONCoffeeLimited'] });
        },
    });
};

export const useUpdateKAJONCoffeeLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('KAJON Coffee Limited').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KAJONCoffeeLimited'] });
        },
    });
};

export const useDeleteKAJONCoffeeLimited = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('KAJON Coffee Limited').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['KAJONCoffeeLimited'] });
        },
    });
};