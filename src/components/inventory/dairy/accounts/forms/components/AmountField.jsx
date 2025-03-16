
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AmountField = ({ register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>Amount</Label>
      <Input 
        type="number" 
        step="0.01"
        {...register("amount", { 
          required: "Amount is required",
          min: { value: 0.01, message: "Amount must be greater than 0" }
        })} 
      />
      {errors.amount && (
        <p className="text-sm text-red-500">{errors.amount.message}</p>
      )}
    </div>
  );
};

export default AmountField;
