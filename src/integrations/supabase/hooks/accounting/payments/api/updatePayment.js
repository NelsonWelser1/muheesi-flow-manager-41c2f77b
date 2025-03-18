
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Update an existing payment record
 * @param {number|string} id - Payment record ID
 * @param {Object} data - Updated payment data
 * @returns {Promise<Object>} - Result object
 */
export const updatePayment = async (id, data) => {
  try {
    console.log('Updating payment/receipt with ID:', id, 'Data:', data);
    
    const { error } = await supabase
      .from('payments_receipts')
      .update({
        payment_type: data.paymentType,
        party_name: data.partyName,
        payment_date: data.paymentDate,
        amount: parseFloat(data.amount),
        currency: data.currency,
        payment_method: data.paymentMethod,
        reference_number: data.referenceNumber,
        status: data.status,
        notes: data.notes
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (err) {
    console.error('Error updating payment/receipt:', err);
    return { success: false, error: err };
  }
};
