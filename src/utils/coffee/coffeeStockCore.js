
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Fetch coffee stock data with optional filters
 * @param {Object} options - Query options
 * @param {string} options.statusFilter - Filter by status
 * @param {Date} options.startDate - Start date for time range filter
 * @param {Date} options.endDate - End date for time range filter
 * @param {string} options.sortField - Field to sort by
 * @param {boolean} options.ascending - Sort direction
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} - Coffee stock data
 */
export const fetchCoffeeStock = async ({
  statusFilter = null,
  startDate = null,
  endDate = null,
  sortField = 'created_at',
  ascending = false,
  limit = null
} = {}) => {
  try {
    let query = supabase.from('coffee_stock').select('*');
    
    // Apply status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    // Apply date range filter if provided
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    // Apply sorting
    query = query.order(sortField, { ascending });
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching coffee stock:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception when fetching coffee stock:', err);
    throw err;
  }
};

/**
 * Update the status of a coffee stock entry
 * @param {string} id - Coffee stock entry ID
 * @param {string} status - New status value
 * @returns {Promise<Object>} - Updated coffee stock entry
 */
export const updateCoffeeStockStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('coffee_stock')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating coffee stock status:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Exception when updating coffee stock status:', err);
    throw err;
  }
};
