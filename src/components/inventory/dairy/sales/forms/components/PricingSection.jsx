
import React from 'react';
import { Input } from "@/components/ui/input";
import FormField from './FormField';

const PricingSection = ({ register, errors }) => {
  return (
    <>
      <FormField
        label="Quantity"
        error={errors.quantity?.message}
      >
        <Input 
          type="number" 
          {...register("quantity", { 
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" }
          })} 
        />
      </FormField>

      <FormField
        label="Unit Price (UGX)"
        error={errors.unitPrice?.message}
      >
        <Input 
          type="number" 
          {...register("unitPrice", { 
            required: "Unit price is required",
            min: { value: 0, message: "Price cannot be negative" }
          })} 
        />
      </FormField>

      <FormField
        label="Discount (%)"
        error={errors.discount?.message}
      >
        <Input 
          type="number" 
          {...register("discount", { 
            min: { value: 0, message: "Discount cannot be negative" },
            max: { value: 100, message: "Discount cannot exceed 100%" }
          })} 
        />
      </FormField>
    </>
  );
};

export default PricingSection;
