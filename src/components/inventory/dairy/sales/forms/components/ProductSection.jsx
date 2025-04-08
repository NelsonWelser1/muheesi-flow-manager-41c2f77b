
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from './FormField';
import { PRODUCT_TYPES } from '../utils/productTypes';

const ProductSection = ({ 
  register, 
  errors, 
  setValue, 
  selectedProduct, 
  productTypes 
}) => {
  // Filter out any empty product types
  const validProductTypes = productTypes.filter(type => type && type.trim() !== '');
  
  return (
    <>
      <FormField
        label="Product"
        error={errors.product?.message}
      >
        <Select onValueChange={(value) => setValue("product", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cheese">Cheese</SelectItem>
            <SelectItem value="yogurt">Yogurt</SelectItem>
            <SelectItem value="milk">Fresh Milk</SelectItem>
            <SelectItem value="processed_milk">Processed Milk</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("product", { required: "Product is required" })} />
      </FormField>

      <FormField
        label="Product Type"
        error={errors.productType?.message}
      >
        <Select 
          onValueChange={(value) => setValue("productType", value)}
          disabled={!selectedProduct || validProductTypes.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            {validProductTypes.length > 0 ? (
              validProductTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="default-type">Default Type</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("productType")} />
      </FormField>
    </>
  );
};

export default ProductSection;
