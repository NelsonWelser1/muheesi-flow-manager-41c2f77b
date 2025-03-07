
import { supabase } from '@/integrations/supabase';

/**
 * Operations for updating deliveries in Supabase
 */
export const deliveryUpdate = {
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
  }
};
