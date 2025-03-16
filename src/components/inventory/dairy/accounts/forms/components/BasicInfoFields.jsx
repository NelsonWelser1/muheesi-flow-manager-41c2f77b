
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BillNumberField from './BillNumberField';

const BasicInfoFields = ({ register, errors }) => {
  return (
    <>
      <BillNumberField register={register} errors={errors} />

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
    </>
  );
};

export default BasicInfoFields;
