
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { fromSupabase } from '../../utils/supabaseUtils';

/**
 * Hook to fetch a single coffee inventory item by ID
 */
export const useKAJONCoffee = (id) => useQuery({
    queryKey: ['kajonCoffee', id],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*').eq('id', id).single()),
    enabled: !!id,
});

/**
 * Hook to fetch coffee inventory items with optional filters
 */
export const useKAJONCoffees = (filters = {}) => useQuery({
    queryKey: ['kajonCoffee', filters],
    queryFn: async () => {
        try {
            let query = supabase.from('coffee_inventory').select('*');
            
            // Apply filters if provided
            if (filters.location) {
                query = query.eq('location', filters.location);
            }
            if (filters.coffeeType) {
                query = query.eq('coffeeType', filters.coffeeType);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.startDate && filters.endDate) {
                query = query.gte('created_at', filters.startDate).lte('created_at', filters.endDate);
            }
            
            // Sort by newest first
            query = query.order('created_at', { ascending: false });
            
            const data = await fromSupabase(query);
            console.log("Fetched coffee inventory data:", data);
            return data || [];
        } catch (error) {
            console.error("Error fetching coffee inventory:", error);
            throw error;
        }
    },
});

/**
 * Hook to fetch all coffee inventory items
 */
export const useCoffeeInventory = () => useQuery({
    queryKey: ['coffeeInventory'],
    queryFn: async () => {
        try {
            const data = await fromSupabase(supabase.from('coffee_inventory').select('*'));
            return data || [];
        } catch (error) {
            console.error("Error fetching coffee inventory:", error);
            return [];
        }
    },
});

/**
 * Hook to fetch coffee sales records
 */
export const useCoffeeSalesRecords = () => useQuery({
    queryKey: ['coffeeSales'],
    queryFn: () => fromSupabase(supabase.from('coffee_sales_records').select('*')),
});

/**
 * Hook to fetch inventory by location
 */
export const useGetInventoryByLocation = (location) => useQuery({
    queryKey: ['coffeeInventory', 'location', location],
    queryFn: () => fromSupabase(
        supabase.from('coffee_inventory')
            .select('*')
            .eq('location', location)
            .order('created_at', { ascending: false })
    ),
    enabled: !!location,
});
