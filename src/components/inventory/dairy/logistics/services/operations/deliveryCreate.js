
import { supabase } from '@/integrations/supabase';

/**
 * Operations for creating deliveries in Supabase
 */
export const deliveryCreate = {
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
  }
};
