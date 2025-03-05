
import React from 'react';
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash, 
  ChevronUp, 
  ChevronDown, 
  DollarSign, 
  Euro,
  PoundSterling,
  Yen
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const ProductsSection = ({ 
  products, 
  handleProductChange,
  addProduct,
  removeProduct,
  currency,
  setCurrency,
  cycleCurrency,
  currencies,
  grandTotal
}) => {
  // Function to get the currency icon
  const getCurrencyIcon = (curr) => {
    switch(curr) {
      case '$': return <DollarSign className="h-4 w-4" />;
      case '€': return <Euro className="h-4 w-4" />;
      case '£': return <PoundSterling className="h-4 w-4" />;
      case '¥': return <Yen className="h-4 w-4" />;
      default: return 'UGX';
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
              <FormLabel>Base Price</FormLabel>
              <div className="flex relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="absolute left-0 inset-y-0 flex items-center pl-3 text-gray-500 cursor-pointer">
                      {typeof getCurrencyIcon(currency) === 'string' ? currency : getCurrencyIcon(currency)}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border">
                    {currencies.map((curr) => (
                      <DropdownMenuItem 
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        {typeof getCurrencyIcon(curr) === 'string' ? curr : getCurrencyIcon(curr)}
                        <span>{curr}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter base price"
                  value={product.base_price}
                  onChange={(e) => handleProductChange(index, 'base_price', e.target.value)}
                  className="pl-10"
                />
                <div className="absolute right-0 inset-y-0 flex flex-col">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-8 p-0"
                    onClick={() => cycleCurrency('up')}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-8 p-0"
                    onClick={() => cycleCurrency('down')}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
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
              <FormLabel>Final Price</FormLabel>
              <div className="flex relative">
                <div className="absolute left-0 inset-y-0 flex items-center pl-3 text-gray-500">
                  {typeof getCurrencyIcon(currency) === 'string' ? currency : getCurrencyIcon(currency)}
                </div>
                <Input
                  readOnly
                  className="bg-gray-100 pl-10"
                  value={product.final_price}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <div className="flex justify-end items-center space-x-2 mt-4 font-bold">
        <span>Grand Total:</span>
        <div className="flex relative w-32">
          <div className="absolute left-0 inset-y-0 flex items-center pl-3 text-gray-500">
            {typeof getCurrencyIcon(currency) === 'string' ? currency : getCurrencyIcon(currency)}
          </div>
          <Input
            readOnly
            className="bg-gray-100 pl-10 font-bold"
            value={grandTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
