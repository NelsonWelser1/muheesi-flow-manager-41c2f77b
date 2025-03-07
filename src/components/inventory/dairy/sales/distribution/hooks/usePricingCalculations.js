
import { useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../utils/formatters';

export const usePricingCalculations = ({ 
  quantity, 
  pricePerUnit, 
  currency, 
  setValue, 
  getValues 
}) => {
  // Auto-calculate total price whenever quantity or pricePerUnit changes
  useEffect(() => {
    if (quantity && pricePerUnit) {
      const numericPrice = parseCurrency(pricePerUnit);
      const totalPrice = Number(quantity) * Number(numericPrice);
      setValue('total_price', formatCurrency(totalPrice, currency));
    }
  }, [quantity, pricePerUnit, setValue, currency]);

  // Update price format when currency changes
  useEffect(() => {
    const currentPrice = getValues('price_per_unit');
    const currentTotal = getValues('total_price');
    
    if (currentPrice) {
      setValue('price_per_unit', formatCurrency(parseCurrency(currentPrice), currency));
    }
    
    if (currentTotal) {
      setValue('total_price', formatCurrency(parseCurrency(currentTotal), currency));
    }
  }, [currency, setValue, getValues]);

  // Handler for price per unit input to format as currency
  const handlePricePerUnitChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('price_per_unit', formatCurrency(numericValue, currency));
    }
  };

  return {
    handlePricePerUnitChange
  };
};
