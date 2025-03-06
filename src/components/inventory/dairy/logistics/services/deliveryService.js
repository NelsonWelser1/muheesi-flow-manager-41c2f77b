
import { supabase } from '@/integrations/supabase';

/**
 * Service for handling delivery data operations with Supabase
 */
export const deliveryService = {
  /**
   * Fetch all deliveries from the database
   */
  fetchAll: async () => {
    console.log('Fetching deliveries from Supabase database...');
    const { data: session } = await supabase.auth.getSession();
    
    // Check authentication
    if (!session?.session) {
      console.log('User not authenticated, returning demo data');
      // Return demo data for unauthenticated users
      return [
        { id: 'demo-1', delivery_id: 'DEMO-001', customer_name: 'Demo Customer', status: 'Delivered' },
        { id: 'demo-2', delivery_id: 'DEMO-002', customer_name: 'Demo Customer 2', status: 'In Transit' },
      ];
    }
    
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
    const { data: session } = await supabase.auth.getSession();
    
    // Check authentication
    if (!session?.session) {
      console.error('Authentication required to create delivery');
      throw new Error('You must be logged in to submit delivery records');
    }
    
    // Add user ID to the delivery data
    const userData = {
      ...deliveryData,
      operator_id: session.session.user.id
    };
    
    const { data, error } = await supabase
      .from('logistics_deliveries')
      .insert([userData])
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
    const { data: session } = await supabase.auth.getSession();
    
    // Check authentication
    if (!session?.session) {
      console.error('Authentication required to fetch delivery details');
      throw new Error('You must be logged in to view delivery details');
    }
    
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
    const { data: session } = await supabase.auth.getSession();
    
    // Check authentication
    if (!session?.session) {
      console.error('Authentication required to update delivery');
      throw new Error('You must be logged in to update delivery records');
    }
    
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
    const { data: session } = await supabase.auth.getSession();
    
    // Check authentication
    if (!session?.session) {
      console.error('Authentication required to delete delivery');
      throw new Error('You must be logged in to delete delivery records');
    }
    
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
