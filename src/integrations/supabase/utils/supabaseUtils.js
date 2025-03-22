
import { supabase } from '../supabase';

/**
 * Helper function to safely execute Supabase queries and handle errors
 * @param {Promise} query - Supabase query to execute
 * @returns {Promise<any>} - Query result data
 */
export const fromSupabase = async (query) => {
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

/**
 * Force schema refresh on module load
 */
export const refreshCoffeeInventorySchema = () => {
    supabase.from('coffee_inventory').select('coffeeType').limit(1)
        .then(() => console.log("Successfully refreshed coffee_inventory schema"))
        .catch(err => console.error("Error refreshing schema:", err));
};

// Execute schema refresh
refreshCoffeeInventorySchema();
