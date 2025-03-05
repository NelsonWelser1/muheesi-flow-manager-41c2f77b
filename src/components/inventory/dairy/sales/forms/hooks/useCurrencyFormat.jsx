
import { useState } from 'react';

export const useCurrencyFormat = (initialCurrency = 'UGX') => {
  const [currency, setCurrency] = useState(initialCurrency);

  // Format number with commas and currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
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

  // Parse currency string back to number
  const parseCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '');
  };

  return {
    currency,
    setCurrency,
    formatCurrency,
    parseCurrency
  };
};

export default useCurrencyFormat;
