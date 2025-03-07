
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PayrollPayslipsFormFields = ({ register, errors, setValue, watch, generatePayslipNumber }) => {
  const basicSalary = watch('basicSalary') || 0;
  const taxAmount = watch('taxAmount') || 0;
  const nssfAmount = watch('nssfAmount') || 0;
  const loanDeduction = watch('loanDeduction') || 0;
  const otherDeductions = watch('otherDeductions') || 0;
  
  const totalDeductions = parseFloat(taxAmount) + parseFloat(nssfAmount) + 
                         parseFloat(loanDeduction) + parseFloat(otherDeductions);
  const netSalary = parseFloat(basicSalary) - totalDeductions;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payslip Number</Label>
          <Input 
            value={generatePayslipNumber()} 
            readOnly 
            className="bg-gray-50"
            {...register("payslipNumber")} 
          />
        </div>

        <div className="space-y-2">
          <Label>Employee Name</Label>
          <Input {...register("employeeName", { required: "Employee name is required" })} />
          {errors.employeeName && (
            <p className="text-sm text-red-500">{errors.employeeName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Employee ID</Label>
          <Input {...register("employeeId", { required: "Employee ID is required" })} />
          {errors.employeeId && (
            <p className="text-sm text-red-500">{errors.employeeId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Input {...register("department")} />
        </div>

        <div className="space-y-2">
          <Label>Salary Period</Label>
          <Select 
            defaultValue="monthly"
            onValueChange={(value) => setValue("salaryPeriod", value)}
          >
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
          <Input type="date" {...register("paymentDate", { required: "Payment date is required" })} />
          {errors.paymentDate && (
            <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Basic Salary</Label>
          <Input 
            type="number" 
            step="0.01"
            {...register("basicSalary", { 
              required: "Basic salary is required",
              min: { value: 0, message: "Salary cannot be negative" }
            })} 
          />
          {errors.basicSalary && (
            <p className="text-sm text-red-500">{errors.basicSalary.message}</p>
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
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("currency")} />
        </div>

        <div className="space-y-2">
          <Label>Tax Amount</Label>
          <Input 
            type="number" 
            step="0.01"
            defaultValue="0"
            {...register("taxAmount", { 
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.taxAmount && (
            <p className="text-sm text-red-500">{errors.taxAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>NSSF Amount</Label>
          <Input 
            type="number" 
            step="0.01"
            defaultValue="0"
            {...register("nssfAmount", { 
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.nssfAmount && (
            <p className="text-sm text-red-500">{errors.nssfAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Loan Deduction</Label>
          <Input 
            type="number" 
            step="0.01"
            defaultValue="0"
            {...register("loanDeduction", { 
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.loanDeduction && (
            <p className="text-sm text-red-500">{errors.loanDeduction.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Other Deductions</Label>
          <Input 
            type="number" 
            step="0.01"
            defaultValue="0"
            {...register("otherDeductions", { 
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.otherDeductions && (
            <p className="text-sm text-red-500">{errors.otherDeductions.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Net Salary (Auto-calculated)</Label>
        <Input 
          type="number" 
          value={netSalary.toFixed(2)} 
          readOnly 
          className="bg-gray-50 font-bold"
        />
      </div>
    </>
  );
};

export default PayrollPayslipsFormFields;
