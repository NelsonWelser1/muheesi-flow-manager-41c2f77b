import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useKAJONCoffee = (id) => useQuery({
    queryKey: ['kajonCoffee', id],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*').eq('id', id).single()),
});

export const useKAJONCoffees = () => useQuery({
    queryKey: ['kajonCoffee'],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*')),
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
        mutationFn: (newCoffee) => fromSupabase(supabase.from('coffee_inventory').insert([{
            ...newCoffee,
            created_at: new Date().toISOString(),
        }])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};

export const useUpdateKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => 
            fromSupabase(supabase.from('coffee_inventory').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};

export const useDeleteKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('coffee_inventory').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};