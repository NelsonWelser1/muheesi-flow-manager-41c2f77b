
import React from 'react';
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const ProductsSection = ({ 
  products, 
  handleProductChange,
  addProduct,
  removeProduct 
}) => {
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
            <div className="space-y-2">
              <FormLabel>Category</FormLabel>
              <Input
                placeholder="Enter product category"
                value={product.category}
                onChange={(e) => handleProductChange(index, 'category', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Base Price ($)</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter base price"
                value={product.base_price}
                onChange={(e) => handleProductChange(index, 'base_price', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Discount (%)</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter discount percentage"
                value={product.discount}
                onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Final Price ($)</FormLabel>
              <Input
                readOnly
                className="bg-gray-100"
                value={product.final_price}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductsSection;
