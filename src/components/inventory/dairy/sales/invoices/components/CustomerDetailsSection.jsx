
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CustomerDetailsSection = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Invoice Number</Label>
        <Input 
          defaultValue={`INV-${Date.now().toString().slice(-6)}`} 
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
  );
};

export default CustomerDetailsSection;
