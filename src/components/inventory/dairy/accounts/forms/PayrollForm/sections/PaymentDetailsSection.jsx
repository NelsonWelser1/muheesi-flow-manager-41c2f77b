
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentDetailsSection = ({ register, setValue }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Payment Status</Label>
        <Select defaultValue="pending" onValueChange={value => setValue("paymentStatus", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentStatus")} />
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select defaultValue="bank_transfer" onValueChange={value => setValue("paymentMethod", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentMethod", {
          value: "bank_transfer"
        })} />
      </div>
    </>
  );
};

export default PaymentDetailsSection;
