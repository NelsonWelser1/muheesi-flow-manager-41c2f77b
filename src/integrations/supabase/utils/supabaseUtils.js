
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
 * Helper function to insert milk production data
 * @param {Object} milkData - Milk production data to insert
 * @returns {Promise<Object>} - Inserted data
 */
export const insertMilkProduction = async (milkData) => {
    return fromSupabase(
        supabase.from('kashari_milk_production').insert(milkData).select()
    );
};

/**
 * Helper function to fetch milk production data with optional filters
 * @param {Object} filters - Optional filters for the query
 * @returns {Promise<Array>} - Milk production data
 */
export const fetchMilkProduction = async (filters = {}) => {
    let query = supabase.from('kashari_milk_production').select('*');
    
    // Apply filters if provided
    if (filters.date) {
        query = query.eq('date', filters.date);
    }
    if (filters.session) {
        query = query.eq('session', filters.session);
    }
    // Add more filters as needed
    
    query = query.order('date', { ascending: false });
    
    return fromSupabase(query);
};

// Additional helper functions can be added here
