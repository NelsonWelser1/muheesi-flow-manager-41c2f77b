
import { useProductsFetching } from './useProductsFetching';
import { useCurrencyFormat } from './useCurrencyFormat';
import { useProductCalculations } from './useProductCalculations';
import { useProductActions } from './useProductActions';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useProductSelection = (setValue, watch, initialCurrency) => {
  const { toast } = useToast();
  
  // Use smaller, focused hooks
  const { loading, products } = useProductsFetching();
  const { currency, setCurrency, formatCurrency, parseCurrency } = useCurrencyFormat(initialCurrency);
  const { handlePriceChange, calculateGrandTotal } = useProductCalculations(setValue, watch, formatCurrency, parseCurrency);
  const { selectedProducts, setSelectedProducts, handleAddProduct, removeProduct } = useProductActions(setValue, watch, formatCurrency);
  
  // Handle product selection
  const handleProductSelect = (productId) => {
    console.log("Product selected:", productId);
    if (!products || !products.length) {
      console.log("No products available to select from");
      return;
    }
    
    // Pass products to the action handler
    useProductActions(setValue, watch, formatCurrency).handleProductSelect(productId, products);
  };

  return {
    loading,
    products,
    selectedProducts,
    setSelectedProducts,
    currency,
    setCurrency,
    handleProductSelect,
    handlePriceChange,
    handleAddProduct,
    removeProduct,
    calculateGrandTotal,
    formatCurrency,
    parseCurrency
  };
};

export default useProductSelection;
