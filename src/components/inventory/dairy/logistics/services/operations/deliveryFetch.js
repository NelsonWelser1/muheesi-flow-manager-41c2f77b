
import { supabase } from '@/integrations/supabase';

/**
 * Operations for fetching delivery data from Supabase
 */
export const deliveryFetch = {
  /**
   * Fetch all deliveries from the database
   */
  fetchAll: async () => {
    console.log('Fetching deliveries from Supabase database...');
    try {
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log(`Successfully fetched ${data?.length || 0} deliveries:`, data);
      return data || [];
    } catch (error) {
      console.error('Error in fetchAll:', error);
      throw error;
    }
  },

  /**
   * Get a delivery by ID
   */
  getById: async (id) => {
    console.log('Fetching delivery by ID:', id);
    try {
      if (!id) {
        throw new Error('Delivery ID is required');
      }
      
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase fetch by ID error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Delivery details retrieved:', data);
      return data;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }
};
