
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PayrollPayslipsFormFields = ({ register, errors, setValue, watch, generatePayslipNumber }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Payslip Number</Label>
          <Input 
            defaultValue={generatePayslipNumber()} 
            readOnly 
            className="bg-gray-50"
            {...register("payslipNumber")} 
          />
        </div>

        <div className="space-y-2">
          <Label>Employee Name</Label>
          <Input 
            {...register("employeeName", { required: "Employee name is required" })} 
          />
          {errors.employeeName && (
            <p className="text-sm text-red-500">{errors.employeeName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Employee ID</Label>
          <Input 
            {...register("employeeId", { required: "Employee ID is required" })} 
          />
          {errors.employeeId && (
            <p className="text-sm text-red-500">{errors.employeeId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Input 
            {...register("department")} 
          />
        </div>

        <div className="space-y-2">
          <Label>Position/Job Title</Label>
          <Input 
            {...register("jobTitle")} 
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Date</Label>
          <Input 
            type="date" 
            {...register("paymentDate", { required: "Payment date is required" })} 
          />
          {errors.paymentDate && (
            <p className="text-sm text-red-500">{errors.paymentDate.message}</p>
          )}
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
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("salaryPeriod")} />
        </div>

        <div className="space-y-2">
          <Label>Period Start Date</Label>
          <Input 
            type="date" 
            {...register("periodStartDate", { required: "Period start date is required" })} 
          />
          {errors.periodStartDate && (
            <p className="text-sm text-red-500">{errors.periodStartDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Period End Date</Label>
          <Input 
            type="date" 
            {...register("periodEndDate", { required: "Period end date is required" })} 
          />
          {errors.periodEndDate && (
            <p className="text-sm text-red-500">{errors.periodEndDate.message}</p>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4 mt-4">
        <h3 className="font-medium text-lg">Salary Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Basic Salary</Label>
            <Input 
              type="number" 
              {...register("basicSalary", { required: "Basic salary is required" })} 
              placeholder="0.00"
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
                <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
            <Input type="hidden" {...register("currency")} />
          </div>

          <div className="space-y-2">
            <Label>Tax Amount</Label>
            <Input 
              type="number" 
              {...register("taxAmount")} 
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>NSSF Amount</Label>
            <Input 
              type="number" 
              {...register("nssfAmount")} 
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Loan Deduction</Label>
            <Input 
              type="number" 
              {...register("loanDeduction")} 
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Other Deductions</Label>
            <Input 
              type="number" 
              {...register("otherDeductions")} 
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <Label>Additional Notes</Label>
        <Textarea 
          {...register("notes")} 
          placeholder="Additional notes about the payroll..."
          className="min-h-20"
        />
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
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input type="hidden" {...register("paymentStatus")} />
      </div>
    </>
  );
};

export default PayrollPayslipsFormFields;
