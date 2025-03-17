
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PaymentNumberField = ({ value, register }) => {
  return (
    <div className="space-y-2">
      <Label>Payment Number</Label>
      <Input 
        value={value || ''} 
        readOnly 
        className="bg-gray-50"
        {...register("paymentNumber")} 
      />
    </div>
  );
};

export default PaymentNumberField;
