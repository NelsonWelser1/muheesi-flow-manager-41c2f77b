
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PaymentDetailsFields = ({ register, errors, setValue }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Payment Date</Label>
        <Input 
          type="date"
          {...register("paymentDate", { required: true })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input 
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register("amount", { required: true })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Currency</Label>
        <Select onValueChange={(value) => setValue("currency", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select onValueChange={(value) => setValue("paymentMethod", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Reference Number</Label>
        <Input 
          placeholder="Optional reference number"
          {...register("referenceNumber")}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <Select onValueChange={(value) => setValue("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 col-span-2">
        <Label>Notes</Label>
        <Textarea 
          placeholder="Add any additional notes"
          {...register("notes")}
        />
      </div>
    </>
  );
};

export default PaymentDetailsFields;
