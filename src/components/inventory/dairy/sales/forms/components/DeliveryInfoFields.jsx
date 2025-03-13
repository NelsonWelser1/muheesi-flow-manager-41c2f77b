
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from './FormField';

const DeliveryInfoFields = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Sales Order Reference"
        error={errors.orderReference?.message}
      >
        <Input {...register("orderReference", { required: "Order reference is required" })} />
      </FormField>

      <FormField
        label="Delivery Date"
        error={errors.deliveryDate?.message}
      >
        <Input type="date" {...register("deliveryDate", { required: "Delivery date is required" })} />
      </FormField>

      <FormField
        label="Receiver Name"
        error={errors.receiverName?.message}
      >
        <Input {...register("receiverName", { required: "Receiver name is required" })} />
      </FormField>

      <FormField
        label="Receiver Contact"
        error={errors.receiverContact?.message}
      >
        <Input {...register("receiverContact", { required: "Receiver contact is required" })} />
      </FormField>

      <FormField
        label="Delivery Location"
        error={errors.deliveryLocation?.message}
      >
        <Input {...register("deliveryLocation", { required: "Delivery location is required" })} />
      </FormField>

      <FormField
        label="Delivery Person/Driver"
        error={null}
      >
        <Input {...register("deliveryPerson")} />
      </FormField>

      <FormField
        label="Delivery Status"
        error={null}
      >
        <Select 
          defaultValue="pending"
          onValueChange={(value) => setValue("deliveryStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("deliveryStatus")} />
      </FormField>
    </div>
  );
};

export default DeliveryInfoFields;
