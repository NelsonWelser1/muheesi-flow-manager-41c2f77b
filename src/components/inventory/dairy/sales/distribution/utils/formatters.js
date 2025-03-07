
/**
 * Utility functions for formatting currency values
 */
export const formatCurrency = (value, currency = 'UGX') => {
  if (!value) return '';
  
  // Remove any non-numeric characters except decimal point
  const numericValue = value.toString().replace(/[^0-9.]/g, '');
  const number = parseFloat(numericValue);
  if (isNaN(number)) return '';
  
  // Format with commas
  const parts = number.toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Add currency symbol
  return currency === 'USD' ? `$${parts.join('.')}` : `UGX ${parts.join('.')}`;
};

export const parseCurrency = (value) => {
  if (!value) return '';
  return value.toString().replace(/[^0-9.]/g, '');
};
