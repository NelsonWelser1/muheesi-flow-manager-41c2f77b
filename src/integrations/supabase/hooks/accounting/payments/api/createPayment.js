
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Create a new payment record
 * @param {Object} data - Payment data
 * @returns {Promise<Object>} - Result object
 */
export const createPayment = async (data) => {
  try {
    console.log('Creating payment/receipt with data:', data);
    
    const { error } = await supabase
      .from('payments_receipts')
      .insert([{
        payment_number: data.paymentNumber,
        payment_type: data.paymentType,
        party_name: data.partyName,
        payment_date: data.paymentDate,
        amount: parseFloat(data.amount),
        currency: data.currency,
        payment_method: data.paymentMethod,
        reference_number: data.referenceNumber,
        status: data.status,
        notes: data.notes
      }]);
    
    if (error) throw error;
    
    return { success: true };
  } catch (err) {
    console.error('Error creating payment/receipt:', err);
    return { success: false, error: err };
  }
};
