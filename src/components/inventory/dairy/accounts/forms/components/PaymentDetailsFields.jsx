
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PaymentDetailsFields = ({ register, errors, setValue, watch }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input 
            type="date"
            {...register("paymentDate", { required: "Date is required" })}
          />
          {errors.paymentDate && (
            <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input 
            type="number"
            step="0.01"
            placeholder="Enter amount"
            {...register("amount", { 
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than 0" }
            })}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select 
            defaultValue="UGX"
            onValueChange={(value) => setValue("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("currency")} />
        </div>
        
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select 
            defaultValue="bank_transfer"
            onValueChange={(value) => setValue("paymentMethod", value)}
          >
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
          <Input type="hidden" {...register("paymentMethod", { required: "Payment method is required" })} />
          {errors.paymentMethod && (
            <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
          )}
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
          <Select 
            defaultValue="completed"
            onValueChange={(value) => setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("status", { required: "Status is required" })} />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea 
          placeholder="Add any additional notes"
          className="min-h-[100px]"
          {...register("notes")}
        />
      </div>
    </div>
  );
};

export default PaymentDetailsFields;
