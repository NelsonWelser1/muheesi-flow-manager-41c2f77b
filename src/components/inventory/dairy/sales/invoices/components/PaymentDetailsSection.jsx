
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentDetailsSection = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tax (%)</Label>
        <Input 
          type="number" 
          {...register("tax", { 
            min: { value: 0, message: "Tax cannot be negative" },
            max: { value: 100, message: "Tax cannot exceed 100%" }
          })} 
          defaultValue="0"
        />
        {errors.tax && (
          <p className="text-sm text-red-500">{errors.tax.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Discount (%)</Label>
        <Input 
          type="number" 
          {...register("discount", { 
            min: { value: 0, message: "Discount cannot be negative" },
            max: { value: 100, message: "Discount cannot exceed 100%" }
          })} 
          defaultValue="0"
        />
        {errors.discount && (
          <p className="text-sm text-red-500">{errors.discount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Payment Terms</Label>
        <Select 
          defaultValue="bank_transfer"
          onValueChange={(value) => setValue("paymentTerms", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentTerms")} />
      </div>

      <div className="space-y-2">
        <Label>Payment Status</Label>
        <Select 
          defaultValue="pending"
          onValueChange={(value) => setValue("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentStatus")} />
      </div>
    </div>
  );
};

export default PaymentDetailsSection;
