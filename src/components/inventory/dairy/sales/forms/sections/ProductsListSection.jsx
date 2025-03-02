
import React from 'react';
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsListSection = ({ products, setProducts, handleProductChange }) => {
  const addProduct = () => {
    setProducts([...products, { name: '', category: '', description: '', price: '', unit: 'kg' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
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
            <div className="space-y-2">
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Enter product name"
                value={product.name}
                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Category</FormLabel>
              <Input
                placeholder="Enter product category"
                value={product.category}
                onChange={(e) => handleProductChange(index, 'category', e.target.value)}
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
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Enter product price"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Unit</FormLabel>
              <Select
                value={product.unit}
                onValueChange={(value) => handleProductChange(index, 'unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="l">Liter (l)</SelectItem>
                  <SelectItem value="ml">Milliliter (ml)</SelectItem>
                  <SelectItem value="pcs">Piece (pcs)</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductsListSection;
