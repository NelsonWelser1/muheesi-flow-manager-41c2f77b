
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const ProductSelectionSection = ({ 
  register, 
  loading, 
  products, 
  handleProductSelect, 
  handlePriceChange, 
  handleAddProduct 
}) => {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <h3 className="font-medium">Add Products</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.product_type} - {product.batch_id}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-products" disabled>No products found</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Input 
            {...register("product_type")} 
            className="mt-2"
            placeholder="Or type manually"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="product_quantity">Quantity</Label>
          <Input 
            id="product_quantity" 
            type="number"
            min="1"
            {...register("product_quantity")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="product_price">Price Per Unit</Label>
          <Input 
            id="product_price" 
            {...register("product_price")} 
            onChange={handlePriceChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="batch_id">Batch ID</Label>
          <Input 
            id="batch_id" 
            {...register("batch_id")} 
            readOnly
            className="bg-gray-100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit_weight">Unit Weight (g)</Label>
          <Input 
            id="unit_weight" 
            {...register("unit_weight")} 
            readOnly
            className="bg-gray-100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total_amount">Total Amount</Label>
          <Input 
            id="total_amount" 
            {...register("total_amount")} 
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={handleAddProduct}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Product
      </Button>
    </div>
  );
};

export default ProductSelectionSection;
