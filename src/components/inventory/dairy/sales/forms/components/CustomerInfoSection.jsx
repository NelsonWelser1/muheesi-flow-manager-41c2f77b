
import React from 'react';
import { Input } from "@/components/ui/input";
import FormField from './FormField';

const CustomerInfoSection = ({ register, errors }) => {
  return (
    <>
      <FormField
        label="Customer Name"
        error={errors.customerName?.message}
      >
        <Input {...register("customerName", { required: "Customer name is required" })} />
      </FormField>

      <FormField
        label="Order Date"
        error={errors.orderDate?.message}
      >
        <Input type="date" {...register("orderDate", { required: "Order date is required" })} />
      </FormField>
    </>
  );
};

export default CustomerInfoSection;
