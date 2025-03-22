
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';

/**
 * Hook to add a new coffee inventory item
 */
export const useAddKAJONCoffee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCoffee) => {
            console.log("Submitting new coffee inventory:", newCoffee);
            
            // Validate required fields based on the migration schema
            const requiredFields = ['manager', 'location', 'coffeeType', 'qualityGrade', 'source', 'humidity', 'buying_price', 'quantity'];
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
                coffeeType: newCoffee.coffeeType,
                qualityGrade: newCoffee.qualityGrade,
                source: newCoffee.source,
                humidity: newCoffee.humidity,
                buying_price: newCoffee.buying_price,
                currency: newCoffee.currency,
                quantity: newCoffee.quantity,
                unit: newCoffee.unit,
                notes: newCoffee.notes || null,
                status: newCoffee.status
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

/**
 * Hook to update an existing coffee inventory item
 */
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

/**
 * Hook to delete a coffee inventory item
 */
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
