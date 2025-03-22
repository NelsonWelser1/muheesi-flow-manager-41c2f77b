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

// Coffee inventory schema refresh removed
