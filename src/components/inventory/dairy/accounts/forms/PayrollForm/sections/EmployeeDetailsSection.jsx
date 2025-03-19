
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EmployeeDetailsSection = ({ register, errors }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Payslip Number</Label>
        <Input value={register("payslipNumber").value} readOnly className="bg-gray-50" {...register("payslipNumber")} />
      </div>

      <div className="space-y-2">
        <Label>Employee Name</Label>
        <Input {...register("employeeName", {
          required: "Employee name is required"
        })} />
        {errors.employeeName && <p className="text-sm text-red-500">{errors.employeeName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Employee ID</Label>
        <Input {...register("employeeId", {
          required: "Employee ID is required"
        })} />
        {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <Input {...register("department")} />
      </div>
    </>
  );
};

export default EmployeeDetailsSection;
