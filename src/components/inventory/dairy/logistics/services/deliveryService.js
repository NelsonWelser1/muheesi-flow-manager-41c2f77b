
import { supabase } from '@/integrations/supabase';

/**
 * Service for handling delivery data operations with Supabase
 * AUTHENTICATION COMPLETELY BYPASSED - All operations allowed without login
 */
export const deliveryService = {
  /**
   * Fetch all deliveries from the database
   */
  fetchAll: async () => {
    console.log('Fetching deliveries from Supabase database...');
    const { data, error } = await supabase
      .from('logistics_deliveries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} deliveries:`, data);
    return data || [];
  },

  /**
   * Create a new delivery
   */
  create: async (deliveryData) => {
    console.log('Creating new delivery with data:', deliveryData);
    
    // AUTHENTICATION COMPLETELY BYPASSED
    // No auth check is performed - anyone can submit data
    
    const { data, error } = await supabase
      .from('logistics_deliveries')
      .insert([deliveryData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Delivery created successfully:', data[0]);
    return data[0];
  },

  /**
   * Get a delivery by ID
   */
  getById: async (id) => {
    console.log('Fetching delivery by ID:', id);
    // AUTHENTICATION BYPASSED - No auth check for fetching delivery
    const { data, error } = await supabase
      .from('logistics_deliveries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch by ID error:', error);
      throw error;
    }
    
    console.log('Delivery details retrieved:', data);
    return data;
  },

  /**
   * Update a delivery
   */
  update: async (id, updates) => {
    console.log('Updating delivery:', id, 'with data:', updates);
    
    // AUTHENTICATION BYPASSED - No auth check for updates
    const { data, error } = await supabase
      .from('logistics_deliveries')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Delivery updated successfully:', data[0]);
    return data[0];
  },

  /**
   * Delete a delivery
   */
  delete: async (id) => {
    console.log('Deleting delivery with ID:', id);
    // AUTHENTICATION BYPASSED - No auth check for deletion
    const { error } = await supabase
      .from('logistics_deliveries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    console.log('Delivery deleted successfully');
    return true;
  }
};
