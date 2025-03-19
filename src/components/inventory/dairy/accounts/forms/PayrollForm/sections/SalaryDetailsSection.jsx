
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalaryDetailsSection = ({ register, errors, setValue, watch }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Salary Period</Label>
        <Select defaultValue="monthly" onValueChange={value => setValue("salaryPeriod", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("salaryPeriod")} />
      </div>

      <div className="space-y-2">
        <Label>Payment Date</Label>
        <Input type="date" {...register("paymentDate", {
          required: "Payment date is required"
        })} />
        {errors.paymentDate && <p className="text-sm text-red-500">{errors.paymentDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Basic Salary</Label>
        <Input type="number" step="0.01" {...register("basicSalary", {
          required: "Basic salary is required",
          min: {
            value: 0,
            message: "Salary cannot be negative"
          }
        })} />
        {errors.basicSalary && <p className="text-sm text-red-500">{errors.basicSalary.message}</p>}
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
    </>
  );
};

export default SalaryDetailsSection;
