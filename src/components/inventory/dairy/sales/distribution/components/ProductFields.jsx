
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProductFields = ({ register, batchSelected }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Product Type</Label>
        <Input 
          {...register("product_type", { required: true })} 
          readOnly={batchSelected}
          className={batchSelected ? "bg-gray-100" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input 
          type="number" 
          {...register("quantity", { 
            required: true, 
            min: 1,
            valueAsNumber: true 
          })} 
          readOnly={batchSelected}
          className={batchSelected ? "bg-gray-100" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Unit Weight (g)</Label>
        <Input 
          type="number" 
          step="0.01" 
          {...register("unit_weight", { 
            required: true, 
            min: 0,
            valueAsNumber: true 
          })} 
          readOnly={batchSelected}
          className={batchSelected ? "bg-gray-100" : ""}
        />
      </div>
    </>
  );
};

export default ProductFields;
