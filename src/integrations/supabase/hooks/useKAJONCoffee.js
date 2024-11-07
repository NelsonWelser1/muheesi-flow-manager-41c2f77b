import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### KAJON Coffee Limited

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | bigint    | true     |
| created_at | timestamp with time zone | timestamp | true     |

Description: Coffee Business
*/

export const useKAJONCoffee = (id) => useQuery({
    queryKey: ['kajonCoffee', id],
    queryFn: () => fromSupabase(supabase.from('KAJON Coffee Limited').select('*').eq('id', id).single()),
});

export const useKAJONCoffees = () => useQuery({
    queryKey: ['kajonCoffee'],
    queryFn: () => fromSupabase(supabase.from('KAJON Coffee Limited').select('*')),
});

export const useCoffeeInventory = () => useQuery({
    queryKey: ['coffeeInventory'],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*')),
});

export const useCoffeeSalesRecords = () => useQuery({
    queryKey: ['coffeeSales'],
    queryFn: () => fromSupabase(supabase.from('coffee_sales_records').select('*')),
});

export const useAddKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCoffee) => fromSupabase(supabase.from('KAJON Coffee Limited').insert([newCoffee])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
        },
    });
};

export const useUpdateKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('KAJON Coffee Limited').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
        },
    });
};

export const useDeleteKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('KAJON Coffee Limited').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
        },
    });
};