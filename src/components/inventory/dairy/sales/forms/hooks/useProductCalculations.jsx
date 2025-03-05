
import { useEffect } from 'react';

export const useProductCalculations = (setValue, watch, formatCurrency, parseCurrency) => {
  const productQty = watch('product_quantity') || 0;
  const productPrice = watch('product_price') || 0;

  // Auto-calculate total amount whenever quantity or price changes
  useEffect(() => {
    if (productQty && productPrice) {
      const numericPrice = parseCurrency(productPrice);
      const totalAmount = Number(productQty) * Number(numericPrice);
      setValue('total_amount', formatCurrency(totalAmount));
    }
  }, [productQty, productPrice, setValue, formatCurrency, parseCurrency]);

  // Handle price input formatting
  const handlePriceChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('product_price', formatCurrency(numericValue));
    }
  };

  // Calculate grand total from selected products
  const calculateGrandTotal = (selectedProducts) => {
    if (selectedProducts.length === 0) return 0;
    
    return selectedProducts.reduce((total, product) => {
      const amount = parseCurrency(product.total_amount);
      return total + Number(amount);
    }, 0);
  };

  return {
    handlePriceChange,
    calculateGrandTotal
  };
};

export default useProductCalculations;
