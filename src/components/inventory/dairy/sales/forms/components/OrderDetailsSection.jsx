
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from './FormField';

const OrderDetailsSection = ({ register, setValue }) => {
  return (
    <>
      <FormField label="Payment Status">
        <Select 
          defaultValue="pending"
          onValueChange={(value) => setValue("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partially_paid">Partially Paid</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentStatus")} />
      </FormField>

      <FormField label="Sales Representative">
        <Input {...register("salesRep")} />
      </FormField>

      <FormField label="Delivery Required?">
        <Select 
          defaultValue="no"
          onValueChange={(value) => setValue("deliveryRequired", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("deliveryRequired")} />
      </FormField>
    </>
  );
};

export default OrderDetailsSection;
