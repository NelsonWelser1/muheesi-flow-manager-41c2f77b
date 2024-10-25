import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useCoffeeInventory = () => useQuery({
    queryKey: ['coffeeInventory'],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*')),
});

export const useKazoCoffeeStore = () => useQuery({
    queryKey: ['kazoCoffeeStore'],
    queryFn: () => fromSupabase(supabase.from('kazo_coffee_store').select('*')),
});

export const useOutboundShipments = () => useQuery({
    queryKey: ['outboundShipments'],
    queryFn: () => fromSupabase(supabase.from('outbound_coffee_shipments').select('*')),
});

export const useCoffeeSalesRecords = () => useQuery({
    queryKey: ['coffeeSalesRecords'],
    queryFn: () => fromSupabase(supabase.from('coffee_sales_records').select('*')),
});

// Mutations
export const useAddCoffeeInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newInventory) => fromSupabase(supabase.from('coffee_inventory').insert([newInventory])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};