
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentMethodField = ({ setValue, register }) => {
  return (
    <div className="space-y-2">
      <Label>Payment Method</Label>
      <Select 
        defaultValue="bank_transfer"
        onValueChange={(value) => setValue("paymentMethod", value)}
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
    </div>
  );
};

export default PaymentMethodField;
