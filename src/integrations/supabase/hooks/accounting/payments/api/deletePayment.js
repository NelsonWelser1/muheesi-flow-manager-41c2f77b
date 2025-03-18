
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Delete a payment record
 * @param {number|string} id - Payment record ID
 * @returns {Promise<Object>} - Result object
 */
export const deletePayment = async (id) => {
  try {
    console.log('Deleting payment/receipt with ID:', id);
    
    const { error } = await supabase
      .from('payments_receipts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (err) {
    console.error('Error deleting payment/receipt:', err);
    return { success: false, error: err };
  }
};
