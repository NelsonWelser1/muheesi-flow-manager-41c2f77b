
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CustomerInfoFields = ({ register }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Customer Name/ID</Label>
        <Input {...register("customer_name", { required: true })} />
      </div>
      
      <div className="space-y-2">
        <Label>Invoice Number</Label>
        <Input {...register("invoice_number", { required: true })} />
      </div>
    </>
  );
};

export default CustomerInfoFields;
