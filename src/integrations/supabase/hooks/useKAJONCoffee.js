
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    try {
        const { data, error } = await query;
        if (error) {
            console.error("Supabase query error:", error);
            throw new Error(error.message);
        }
        return data;
    } catch (err) {
        console.error("Error in fromSupabase:", err);
        throw err;
    }
};

export const useKAJONCoffee = (id) => useQuery({
    queryKey: ['kajonCoffee', id],
    queryFn: () => fromSupabase(supabase.from('coffee_inventory').select('*').eq('id', id).single()),
    enabled: !!id,
});

export const useKAJONCoffees = (filters = {}) => useQuery({
    queryKey: ['kajonCoffee', filters],
    queryFn: async () => {
        try {
            let query = supabase.from('coffee_inventory').select('*');
            
            // Apply filters if provided
            if (filters.location) {
                query = query.eq('location', filters.location);
            }
            if (filters.coffee_type) {
                query = query.eq('coffee_type', filters.coffee_type);
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

export const useCoffeeSalesRecords = () => useQuery({
    queryKey: ['coffeeSales'],
    queryFn: () => fromSupabase(supabase.from('coffee_sales_records').select('*')),
});

export const useAddKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCoffee) => {
            console.log("Submitting new coffee inventory:", newCoffee);
            
            // Validate required fields based on the migration schema
            const requiredFields = ['manager', 'location', 'coffee_type', 'quality_grade', 'source', 'humidity', 'buying_price', 'quantity'];
            for (const field of requiredFields) {
                if (newCoffee[field] === undefined || newCoffee[field] === null || newCoffee[field] === '') {
                    throw new Error(`${field} is required`);
                }
            }
            
            // Ensure numeric fields are numbers and within constraints
            if (typeof newCoffee.humidity !== 'number') {
                newCoffee.humidity = Number(newCoffee.humidity);
                if (isNaN(newCoffee.humidity)) throw new Error('Humidity must be a valid number');
                if (newCoffee.humidity < 0 || newCoffee.humidity > 100) throw new Error('Humidity must be between 0 and 100');
            }
            
            if (typeof newCoffee.buying_price !== 'number') {
                newCoffee.buying_price = Number(newCoffee.buying_price);
                if (isNaN(newCoffee.buying_price)) throw new Error('Buying price must be a valid number');
                if (newCoffee.buying_price <= 0) throw new Error('Buying price must be greater than 0');
            }
            
            if (typeof newCoffee.quantity !== 'number') {
                newCoffee.quantity = Number(newCoffee.quantity);
                if (isNaN(newCoffee.quantity)) throw new Error('Quantity must be a valid number');
                if (newCoffee.quantity <= 0) throw new Error('Quantity must be greater than 0');
            }
            
            // Set default values if not provided
            if (!newCoffee.currency) newCoffee.currency = 'UGX';
            if (!newCoffee.unit) newCoffee.unit = 'kg';
            if (!newCoffee.status) newCoffee.status = 'active';
            
            const formattedData = {
                manager: newCoffee.manager,
                location: newCoffee.location,
                coffee_type: newCoffee.coffee_type,
                quality_grade: newCoffee.quality_grade,
                source: newCoffee.source,
                humidity: newCoffee.humidity,
                buying_price: newCoffee.buying_price,
                currency: newCoffee.currency,
                quantity: newCoffee.quantity,
                unit: newCoffee.unit,
                notes: newCoffee.notes || null,
                status: newCoffee.status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            console.log("Formatted data for submission:", formattedData);
            
            const { data, error } = await supabase
                .from('coffee_inventory')
                .insert([formattedData])
                .select();
            
            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }
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
            
            // Format numeric fields
            if (updateData.humidity !== undefined) {
                updateData.humidity = Number(updateData.humidity);
                if (isNaN(updateData.humidity)) throw new Error('Humidity must be a valid number');
                if (updateData.humidity < 0 || updateData.humidity > 100) throw new Error('Humidity must be between 0 and 100');
            }
            
            if (updateData.buying_price !== undefined) {
                updateData.buying_price = Number(updateData.buying_price);
                if (isNaN(updateData.buying_price)) throw new Error('Buying price must be a valid number');
                if (updateData.buying_price <= 0) throw new Error('Buying price must be greater than 0');
            }
            
            if (updateData.quantity !== undefined) {
                updateData.quantity = Number(updateData.quantity);
                if (isNaN(updateData.quantity)) throw new Error('Quantity must be a valid number');
                if (updateData.quantity <= 0) throw new Error('Quantity must be greater than 0');
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
