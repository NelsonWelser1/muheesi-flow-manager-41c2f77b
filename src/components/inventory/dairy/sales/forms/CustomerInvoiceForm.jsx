
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Mail, Phone, Eye } from "lucide-react";
import CustomerInvoiceList from '../CustomerInvoiceList';

const CustomerInvoiceForm = ({ onBack }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      paymentStatus: 'pending',
      paymentTerms: 'bank_transfer'
    }
  });
  const { toast } = useToast();
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  
  const onSubmit = (data) => {
    console.log("Invoice data:", data);
    toast({
      title: "Success",
      description: "Invoice created successfully",
    });
    // Here you would normally save to database
  };

  const generateInvoiceNumber = () => {
    // Simple invoice number generation logic
    const prefix = "INV";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowInvoiceList(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View Invoices
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Invoice Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input 
                  defaultValue={generateInvoiceNumber()} 
                  readOnly 
                  className="bg-gray-50"
                  {...register("invoiceNumber")} 
                />
              </div>

              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input {...register("customerName", { required: "Customer name is required" })} />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Customer Contact</Label>
                <Input {...register("customerContact")} />
              </div>

              <div className="space-y-2">
                <Label>Billing Address</Label>
                <Input {...register("billingAddress", { required: "Billing address is required" })} />
                {errors.billingAddress && (
                  <p className="text-sm text-red-500">{errors.billingAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date" {...register("invoiceDate", { required: "Invoice date is required" })} />
                {errors.invoiceDate && (
                  <p className="text-sm text-red-500">{errors.invoiceDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...register("dueDate", { required: "Due date is required" })} />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Itemized Products/Services</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input placeholder="Item description" {...register("itemDescription")} />
                  <Input type="number" placeholder="Quantity" {...register("itemQuantity")} />
                  <Input type="number" placeholder="Unit price" {...register("itemPrice")} />
                  <Input placeholder="Total" readOnly className="bg-gray-50" />
                  <Button type="button" variant="outline">Add Item</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax (%)</Label>
                <Input 
                  type="number" 
                  {...register("tax", { 
                    min: { value: 0, message: "Tax cannot be negative" },
                    max: { value: 100, message: "Tax cannot exceed 100%" }
                  })} 
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

            <div className="space-y-2">
              <Label>Total Amount (Auto-calculated)</Label>
              <Input readOnly className="bg-gray-50" value="UGX 0" />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Create Invoice</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => console.log("Uploading payment proof...")}
              >
                <Upload className="h-4 w-4" />
                Attach Payment Proof
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => console.log("Sending email...")}
              >
                <Mail className="h-4 w-4" />
                Email Invoice
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => console.log("Sending WhatsApp...")}
              >
                <Phone className="h-4 w-4" />
                WhatsApp Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <CustomerInvoiceList
        isOpen={showInvoiceList} 
        onClose={() => setShowInvoiceList(false)}
      />
    </div>
  );
};

export default CustomerInvoiceForm;
