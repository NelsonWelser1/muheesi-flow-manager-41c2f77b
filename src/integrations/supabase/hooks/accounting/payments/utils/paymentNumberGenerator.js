
import { format } from 'date-fns';

/**
 * Generate a unique payment number based on type
 * @param {string} type - 'received' or 'issued'
 * @returns {string} - Formatted payment number
 */
export const generatePaymentNumber = (type) => {
  const prefix = type === 'received' ? 'RCP' : 'PMT';
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${prefix}-${date}-${random}`;
};
