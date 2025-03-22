
/**
 * Core utilities for coffee stock management
 */
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Fetch coffee stock data with optional filters
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - The filtered coffee stock data
 */
export const fetchCoffeeStock = async (options = {}) => {
  const { 
    statusFilter, 
    startDate, 
    endDate, 
    sortField = 'created_at', 
    ascending = false 
  } = options;

  try {
    let query = supabase
      .from('coffee_sales')
      .select('*');
    
    // Apply status filter if specified
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Apply date range filters if specified
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    // Apply sorting
    query = query.order(sortField, { ascending });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (err) {
    console.error('Error fetching coffee stock data:', err);
    throw err;
  }
};

/**
 * Update coffee stock status
 * @param {string} id - Record ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated record
 */
export const updateCoffeeStockStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('coffee_sales')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error('Error updating coffee stock status:', err);
    throw err;
  }
};
