
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PaymentsReceiptsFormFields = ({ register, errors, setValue, watch, generatePaymentNumber }) => {
  const paymentType = watch('paymentType');
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payment/Receipt Number</Label>
          <Input 
            defaultValue={generatePaymentNumber()} 
            readOnly 
            className="bg-gray-50"
            {...register("paymentNumber")} 
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input 
            type="date" 
            {...register("paymentDate", { required: "Payment date is required" })} 
          />
          {errors.paymentDate && (
            <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Type</Label>
          <RadioGroup 
            defaultValue="received" 
            onValueChange={(value) => setValue("paymentType", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="received" id="received" {...register("paymentType")} />
              <Label htmlFor="received">Payment Received</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="made" id="made" {...register("paymentType")} />
              <Label htmlFor="made">Payment Made</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>{paymentType === 'received' ? 'Received From' : 'Paid To'}</Label>
          <Input 
            {...register("partyName", { required: "This field is required" })} 
            placeholder={paymentType === 'received' ? 'Customer name' : 'Vendor name'}
          />
          {errors.partyName && (
            <p className="text-sm text-red-500">{errors.partyName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input 
            type="number"
            {...register("amount", { 
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than zero" } 
            })}
            placeholder="0.00"
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
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
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
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="card">Card Payment</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("paymentMethod")} />
        </div>

        <div className="space-y-2">
          <Label>Reference</Label>
          <Input 
            {...register("reference")} 
            placeholder="Invoice #, PO #, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description/Notes</Label>
        <Textarea 
          {...register("notes")} 
          placeholder="Payment details and notes..."
          className="min-h-20"
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("status")} />
      </div>
    </>
  );
};

export default PaymentsReceiptsFormFields;
