
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentsReceiptsFormFields = ({ register, errors, setValue, watch, generatePaymentNumber }) => {
  const paymentType = watch('paymentType');
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label>Payment Number</Label>
          <Input 
            value={generatePaymentNumber()} 
            readOnly 
            className="bg-gray-50"
            {...register("paymentNumber")} 
          />
        </div>

        <div className="space-y-2">
          <Label>{paymentType === 'received' ? 'Payer Name' : 'Payee Name'}</Label>
          <Input {...register("partyName", { required: "Name is required" })} />
          {errors.partyName && (
            <p className="text-sm text-red-500">{errors.partyName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input type="date" {...register("paymentDate", { required: "Payment date is required" })} />
          {errors.paymentDate && (
            <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Amount</Label>
          <Input 
            type="number" 
            step="0.01"
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
              <SelectItem value="UGX">UGX</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("currency", { value: "UGX" })} />
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
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("paymentMethod")} />
        </div>

        <div className="space-y-2">
          <Label>Reference Number</Label>
          <Input {...register("referenceNumber")} placeholder="Transaction ID / Reference Number" />
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
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("status")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input {...register("notes")} placeholder="Additional notes (optional)" />
      </div>
    </>
  );
};

export default PaymentsReceiptsFormFields;
