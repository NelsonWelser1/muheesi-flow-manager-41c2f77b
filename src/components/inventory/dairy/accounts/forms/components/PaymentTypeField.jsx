
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const PaymentTypeField = ({ setValue, register }) => {
  return (
    <div className="space-y-2">
      <Label>Payment Type</Label>
      <Select 
        defaultValue="received"
        onValueChange={(value) => setValue("paymentType", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select payment type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="received">Payment Received</SelectItem>
          <SelectItem value="issued">Payment Issued</SelectItem>
        </SelectContent>
      </Select>
      <Input type="hidden" {...register("paymentType")} />
    </div>
  );
};

export default PaymentTypeField;
