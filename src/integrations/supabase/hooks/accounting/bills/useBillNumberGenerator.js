
import { supabase } from '../../../supabase';

/**
 * Hook for generating bill numbers
 */
export const useBillNumberGenerator = () => {

  // Get latest bill number and increment it
  const getLatestBillNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('bills_expenses')
        .select('bill_number')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error getting latest bill number:', error);
        return generateBillNumber();
      }
      
      if (data && data.length > 0) {
        const lastBillNumber = data[0].bill_number;
        return incrementBillNumber(lastBillNumber);
      } else {
        return generateBillNumber(10001); // Start from 10001 if no bills exist
      }
    } catch (err) {
      console.error('Error in getLatestBillNumber:', err);
      return generateBillNumber();
    }
  };

  const incrementBillNumber = (lastBillNumber) => {
    try {
      // Extract number from format BILL-XXXXX-XXXX
      const parts = lastBillNumber.split('-');
      if (parts.length >= 2) {
        const lastNumber = parseInt(parts[1], 10);
        const newNumber = lastNumber + 1;
        const timestamp = new Date().getTime().toString().slice(-4);
        return `BILL-${newNumber.toString().padStart(5, '0')}-${timestamp}`;
      }
    } catch (error) {
      console.error('Error incrementing bill number:', error);
    }
    return generateBillNumber();
  };

  const generateBillNumber = (startNum = 10001) => {
    const prefix = "BILL";
    const number = startNum;
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${number.toString().padStart(5, '0')}-${timestamp}`;
  };

  return {
    getLatestBillNumber,
    generateBillNumber
  };
};
