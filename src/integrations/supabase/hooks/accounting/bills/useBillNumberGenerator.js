
import { supabase } from '../../../supabase';

/**
 * Hook for generating bill numbers
 */
export const useBillNumberGenerator = () => {

  // Get latest bill number
  const getLatestBillNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('bills_expenses')
        .select('bill_number')
        .order('bill_number', { ascending: true })
        .limit(1);
      
      if (error) {
        console.error('Error getting latest bill number:', error);
        return generateBillNumber();
      }
      
      if (data && data.length > 0) {
        const lastBillNumber = data[0].bill_number;
        const prefix = "BILL";
        const lastNumber = parseInt(lastBillNumber.split('-')[1], 10);
        const newNumber = lastNumber + 1;
        const timestamp = new Date().getTime().toString().slice(-4);
        return `${prefix}-${newNumber.toString().padStart(5, '0')}-${timestamp}`;
      } else {
        return generateBillNumber(10000); // Start from 10000 if no bills exist
      }
    } catch (err) {
      console.error('Error in getLatestBillNumber:', err);
      return generateBillNumber();
    }
  };

  const generateBillNumber = (startNum = 10000) => {
    const prefix = "BILL";
    const randomNum = startNum + Math.floor(Math.random() * 1000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum.toString().padStart(5, '0')}-${timestamp}`;
  };

  return {
    getLatestBillNumber,
    generateBillNumber
  };
};
