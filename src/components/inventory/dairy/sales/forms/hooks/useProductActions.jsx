
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useProductActions = (setValue, watch, formatCurrency) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { toast } = useToast();

  // Handle product selection
  const handleProductSelect = (productId, products) => {
    if (!products) return;
    const product = products.find(p => p.id === Number(productId));
    if (product) {
      setValue('product_type', product.product_type);
      setValue('batch_id', product.batch_id);
      setValue('product_quantity', product.unit_quantity);
      setValue('unit_weight', product.unit_weight);
      
      // If there's a default price, set it
      if (product.unit_price) {
        setValue('product_price', formatCurrency(product.unit_price));
      }
    }
  };

  // Add product to the list
  const handleAddProduct = () => {
    const productType = watch('product_type');
    const quantity = watch('product_quantity');
    const price = watch('product_price');
    const totalAmount = watch('total_amount');
    
    if (!productType || !quantity || !price || !totalAmount) {
      toast({
        title: "Error",
        description: "Please fill in all product details",
        variant: "destructive",
      });
      return;
    }
    
    // Convert values to appropriate types before saving
    const newProduct = {
      id: selectedProducts.length + 1,
      product_type: productType,
      quantity: Number(quantity),
      price: price,
      total_amount: totalAmount
    };
    
    console.log("Adding product to selection:", newProduct);
    setSelectedProducts([...selectedProducts, newProduct]);
    
    // Clear product fields for next entry
    setValue('product_type', '');
    setValue('batch_id', '');
    setValue('product_quantity', '');
    setValue('product_price', '');
    setValue('total_amount', '');
  };

  // Remove product from the list
  const removeProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return {
    selectedProducts,
    setSelectedProducts,
    handleProductSelect,
    handleAddProduct,
    removeProduct
  };
};

export default useProductActions;
