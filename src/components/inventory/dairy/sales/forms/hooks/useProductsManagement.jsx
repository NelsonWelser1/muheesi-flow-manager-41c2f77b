
import { useState, useEffect } from 'react';

export const useProductsManagement = (onGrandTotalChange) => {
  const [products, setProducts] = useState([{ 
    name: '', 
    category: '', 
    base_price: '', 
    discount: '0', 
    final_price: '0' 
  }]);
  
  const [currency, setCurrency] = useState('UGX');

  // Calculate grand total based on products
  const updateGrandTotal = () => {
    const total = products.reduce((sum, product) => {
      return sum + (parseFloat(product.final_price) || 0);
    }, 0);
    
    if (onGrandTotalChange) {
      onGrandTotalChange(total.toFixed(2));
    }
  };

  // Update grand total whenever products change
  useEffect(() => {
    updateGrandTotal();
  }, [products]);

  // Handle product changes
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    // Calculate final price when base_price or discount changes
    if (field === 'base_price' || field === 'discount') {
      const basePrice = parseFloat(newProducts[index].base_price) || 0;
      const discount = parseFloat(newProducts[index].discount) || 0;
      
      // Ensure discount is treated as a percentage (0-100)
      const finalPrice = basePrice * (1 - discount / 100);
      
      // Set the final price with 2 decimal places
      newProducts[index].final_price = finalPrice.toFixed(2);
    }
    
    setProducts(newProducts);
  };

  // Add a new product
  const addProduct = () => {
    setProducts([...products, { 
      name: '', 
      category: '', 
      base_price: '', 
      discount: '0', 
      final_price: '0' 
    }]);
  };

  // Remove a product
  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  return {
    products,
    setProducts,
    handleProductChange,
    addProduct,
    removeProduct,
    updateGrandTotal,
    currency,
    setCurrency
  };
};

export default useProductsManagement;
