
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Fetch payments and receipts with optional filters
 * @param {Object} filters - Optional filters to apply
 * @returns {Promise<Array>} - Array of payment records
 */
export const fetchPaymentsReceipts = async (filters = {}) => {
  try {
    console.log('Fetching payments & receipts with filters:', filters);
    
    let query = supabase
      .from('payments_receipts')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters.paymentType) {
      query = query.eq('payment_type', filters.paymentType);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.startDate && filters.endDate) {
      query = query
        .gte('payment_date', filters.startDate)
        .lte('payment_date', filters.endDate);
    }
    
    if (filters.search) {
      query = query.or(`party_name.ilike.%${filters.search}%,payment_number.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    console.log('Fetched payments & receipts:', data);
    return data || [];
  } catch (err) {
    console.error('Error fetching payments/receipts:', err);
    throw err;
  }
};
