
import { supabase } from '@/integrations/supabase';

/**
 * Operations for deleting deliveries from Supabase
 */
export const deliveryDelete = {
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
  }
};
