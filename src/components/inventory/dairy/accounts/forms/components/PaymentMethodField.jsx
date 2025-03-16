
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentMethodField = ({ setValue, register, errors }) => {
  // Ensure setValue is properly used
  const handleValueChange = (value) => {
    setValue("paymentMethod", value);
  };

  return (
    <div className="space-y-2">
      <Label>Payment Method</Label>
      <Select 
        defaultValue="bank_transfer"
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          <SelectItem value="credit">Credit</SelectItem>
          <SelectItem value="mobile_money">Mobile Money</SelectItem>
        </SelectContent>
      </Select>
      <Input type="hidden" {...register("paymentMethod")} />
      {errors?.paymentMethod && (
        <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
      )}
    </div>
  );
};

export default PaymentMethodField;
