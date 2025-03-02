
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

const ProductsSection = ({ products, setProducts, updateGrandTotal }) => {
  const { toast } = useToast();
  
  const addProduct = () => {
    setProducts([...products, { name: '', description: '', quantity: '1', price: '', total: '0' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
      updateGrandTotal(newProducts);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newProducts[index].quantity) || 0;
      const price = parseFloat(newProducts[index].price) || 0;
      newProducts[index].total = (quantity * price).toFixed(2);
    }
    
    setProducts(newProducts);
    updateGrandTotal(newProducts);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Products</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProduct}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.map((product, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Product {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProduct(index)}
              disabled={products.length <= 1}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Enter product name"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter product description"
                value={product.description}
                onChange={(e) => handleProductChange(index, 'description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Unit Price</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter unit price"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Total</FormLabel>
              <Input
                readOnly
                className="bg-gray-100"
                value={product.total}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductsSection;
