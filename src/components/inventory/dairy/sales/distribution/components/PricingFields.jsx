
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PricingFields = ({ 
  register, 
  handlePricePerUnitChange, 
  currency 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Price Per Unit</Label>
        <Input 
          {...register("price_per_unit", { required: true })} 
          onChange={handlePricePerUnitChange}
          placeholder={currency === 'USD' ? '$0.00' : 'UGX 0'}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Total Price</Label>
        <Input 
          {...register("total_price")} 
          readOnly 
          className="bg-gray-50"
          placeholder={currency === 'USD' ? '$0.00' : 'UGX 0'}
        />
      </div>
    </>
  );
};

export default PricingFields;
