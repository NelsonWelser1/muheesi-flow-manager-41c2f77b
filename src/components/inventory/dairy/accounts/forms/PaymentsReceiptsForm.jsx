import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CreditCard, Mail, Download } from "lucide-react";
const PaymentsReceiptsForm = ({
  onBack
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'received',
      status: 'completed',
      paymentMethod: 'bank_transfer'
    }
  });
  const {
    toast
  } = useToast();
  const paymentType = watch('paymentType');
  const generatePaymentNumber = () => {
    const prefix = paymentType === 'received' ? "RCPT" : "PMT";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  const onSubmit = data => {
    console.log("Payment/Receipt data:", data);
    toast({
      title: "Success",
      description: `${data.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`
    });
    // Here you would normally save to database
  };
  return <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Payments & Receipts Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select defaultValue="received" onValueChange={value => setValue("paymentType", value)}>
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
                <Input value={generatePaymentNumber()} readOnly className="bg-gray-50" {...register("paymentNumber")} />
              </div>

              <div className="space-y-2">
                <Label>{paymentType === 'received' ? 'Payer Name' : 'Payee Name'}</Label>
                <Input {...register("partyName", {
                required: "Name is required"
              })} />
                {errors.partyName && <p className="text-sm text-red-500">{errors.partyName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" {...register("paymentDate", {
                required: "Payment date is required"
              })} />
                {errors.paymentDate && <p className="text-sm text-red-500">{errors.paymentDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <Input type="number" step="0.01" {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0"
                }
              })} />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="UGX" onValueChange={value => setValue("currency", value)}>
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
                <Input type="hidden" {...register("currency", {
                value: "UGX"
              })} />
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
                <Select defaultValue="completed" onValueChange={value => setValue("status", value)}>
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

            <div className="flex flex-wrap gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">
                Record {paymentType === 'received' ? 'Receipt' : 'Payment'}
              </Button>
              
              
              
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default PaymentsReceiptsForm;