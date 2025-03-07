
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Upload } from "lucide-react";

const BillsExpensesForm = ({ onBack }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending',
      paymentMethod: 'bank_transfer'
    }
  });
  const { toast } = useToast();
  
  const generateBillNumber = () => {
    const prefix = "BILL";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  
  const onSubmit = (data) => {
    console.log("Bill/Expense data:", data);
    toast({
      title: "Success",
      description: "Bill/Expense recorded successfully",
    });
    // Here you would normally save to database
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bill Number</Label>
                <Input 
                  defaultValue={generateBillNumber()} 
                  readOnly 
                  className="bg-gray-50"
                  {...register("billNumber")} 
                />
              </div>

              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <Input {...register("supplierName", { required: "Supplier name is required" })} />
                {errors.supplierName && (
                  <p className="text-sm text-red-500">{errors.supplierName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Bill Date</Label>
                <Input type="date" {...register("billDate", { required: "Bill date is required" })} />
                {errors.billDate && (
                  <p className="text-sm text-red-500">{errors.billDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...register("dueDate", { required: "Due date is required" })} />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Expense Type</Label>
                <Select 
                  onValueChange={(value) => setValue("expenseType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="raw_materials">Raw Materials</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("expenseType")} />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
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
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("paymentMethod")} />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("status")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register("notes")} placeholder="Additional notes (optional)" />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Record Expense</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => console.log("Uploading attachment...")}
              >
                <Upload className="h-4 w-4" />
                Attach Invoice/Receipt
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => console.log("Setting as recurring...")}
              >
                <FileText className="h-4 w-4" />
                Set as Recurring
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesForm;
