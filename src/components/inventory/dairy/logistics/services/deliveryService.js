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
   * Create a new delivery
   */
  create: async (deliveryData) => {
    console.log('Creating new delivery with data:', deliveryData);
    try {
      // Validate required fields
      const requiredFields = ['delivery_id', 'order_id', 'customer_name', 'status', 
                              'pickup_location', 'delivery_location', 
                              'scheduled_pickup_time', 'scheduled_delivery_time'];
      
      const missingFields = requiredFields.filter(field => !deliveryData[field]);
      
      if (missingFields.length > 0) {
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Authentication is temporarily disabled, proceed without operator_id
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .insert([deliveryData])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Delivery created successfully:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error in create:', error);
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
  },

  /**
   * Update a delivery
   */
  update: async (id, updates) => {
    console.log('Updating delivery:', id, 'with data:', updates);
    try {
      if (!id) {
        throw new Error('Delivery ID is required');
      }
      
      const { data, error } = await supabase
        .from('logistics_deliveries')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Delivery updated successfully:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  /**
   * Delete a delivery
   */
  delete: async (id) => {
    console.log('Deleting delivery with ID:', id);
    try {
      if (!id) {
        throw new Error('Delivery ID is required');
      }
      
      const { error } = await supabase
        .from('logistics_deliveries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Delivery deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },
  
  /**
   * Validate delivery data before submission
   */
  validateDeliveryData: (data) => {
    const errors = {};
    
    // Required fields
    const requiredFields = {
      delivery_id: 'Delivery ID',
      order_id: 'Order ID',
      customer_name: 'Customer Name',
      status: 'Status',
      pickup_location: 'Pickup Location',
      delivery_location: 'Delivery Location',
      scheduled_pickup_time: 'Scheduled Pickup Time',
      scheduled_delivery_time: 'Scheduled Delivery Time'
    };
    
    // Check for required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!data[field]) {
        errors[field] = `${label} is required`;
      }
    });
    
    // Validate dates
    if (data.scheduled_pickup_time && data.scheduled_delivery_time) {
      const pickupTime = new Date(data.scheduled_pickup_time);
      const deliveryTime = new Date(data.scheduled_delivery_time);
      
      if (pickupTime > deliveryTime) {
        errors.scheduled_delivery_time = 'Delivery time must be after pickup time';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
