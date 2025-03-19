
import { useCallback } from 'react';

export const useCurrencyFormatter = () => {
  // Format currency values
  const formatCurrency = useCallback((amount, currency = 'UGX') => {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  return { formatCurrency };
};
