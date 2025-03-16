
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BillNumberField = ({ register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>Bill Number</Label>
      <Input 
        {...register("billNumber", { required: "Bill number is required" })}
        readOnly 
        className="bg-gray-50"
      />
      {errors.billNumber && (
        <p className="text-sm text-red-500">{errors.billNumber.message}</p>
      )}
    </div>
  );
};

export default BillNumberField;
