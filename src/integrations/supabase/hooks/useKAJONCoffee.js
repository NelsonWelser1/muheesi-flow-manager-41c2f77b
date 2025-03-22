
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
    enabled: !!id,
});

export const useKAJONCoffees = (filters = {}) => useQuery({
    queryKey: ['kajonCoffee', filters],
    queryFn: async () => {
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
        
        return fromSupabase(query);
    },
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
        mutationFn: async (newCoffee) => {
            console.log("Submitting new coffee inventory:", newCoffee);
            
            // Validate required fields
            const requiredFields = ['manager', 'location', 'coffeeType', 'qualityGrade', 'source', 'quantity', 'buying_price'];
            for (const field of requiredFields) {
                if (!newCoffee[field]) {
                    throw new Error(`${field} is required`);
                }
            }
            
            // Convert numeric fields
            if (newCoffee.quantity) newCoffee.quantity = Number(newCoffee.quantity);
            if (newCoffee.buying_price) newCoffee.buying_price = Number(newCoffee.buying_price);
            if (newCoffee.buyingPrice) newCoffee.buying_price = Number(newCoffee.buyingPrice);
            if (newCoffee.humidity) newCoffee.humidity = Number(newCoffee.humidity);
            
            // Map buyingPrice to buying_price if needed
            if (newCoffee.buyingPrice && !newCoffee.buying_price) {
                newCoffee.buying_price = Number(newCoffee.buyingPrice);
                delete newCoffee.buyingPrice;
            }
            
            const { data, error } = await supabase.from('coffee_inventory').insert([{
                ...newCoffee,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }]).select();
            
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};

export const useUpdateKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            console.log("Updating coffee inventory:", id, updateData);
            
            // Convert numeric fields
            if (updateData.quantity) updateData.quantity = Number(updateData.quantity);
            if (updateData.buying_price) updateData.buying_price = Number(updateData.buying_price);
            if (updateData.buyingPrice) updateData.buying_price = Number(updateData.buyingPrice);
            if (updateData.humidity) updateData.humidity = Number(updateData.humidity);
            
            // Map buyingPrice to buying_price if needed
            if (updateData.buyingPrice && !updateData.buying_price) {
                updateData.buying_price = Number(updateData.buyingPrice);
                delete updateData.buyingPrice;
            }
            
            updateData.updated_at = new Date().toISOString();
            
            const { data, error } = await supabase
                .from('coffee_inventory')
                .update(updateData)
                .eq('id', id)
                .select();
                
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};

export const useDeleteKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            console.log("Deleting coffee inventory:", id);
            const { data, error } = await supabase
                .from('coffee_inventory')
                .delete()
                .eq('id', id)
                .select();
                
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kajonCoffee'] });
            queryClient.invalidateQueries({ queryKey: ['coffeeInventory'] });
        },
    });
};

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
