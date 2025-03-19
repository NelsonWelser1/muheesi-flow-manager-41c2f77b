import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Users, Mail, Download, Eye } from "lucide-react";
import PayrollPayslipsRecords from '../records/PayrollPayslipsRecords';
import { usePayrollPayslips } from './hooks/usePayrollPayslips';
const PayrollPayslipsForm = ({
  onBack
}) => {
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'records'
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      salaryPeriod: 'monthly',
      paymentStatus: 'pending'
    }
  });
  const {
    toast
  } = useToast();
  const {
    loading,
    submitPayrollRecord,
    generatePayslipNumber
  } = usePayrollPayslips();
  const basicSalary = watch('basicSalary') || 0;
  const taxAmount = watch('taxAmount') || 0;
  const nssfAmount = watch('nssfAmount') || 0;
  const loanDeduction = watch('loanDeduction') || 0;
  const otherDeductions = watch('otherDeductions') || 0;

  // Calculate net salary
  const totalDeductions = parseFloat(taxAmount) + parseFloat(nssfAmount) + parseFloat(loanDeduction) + parseFloat(otherDeductions);
  const netSalary = parseFloat(basicSalary) - totalDeductions;

  // Generate payslip number on mount
  useEffect(() => {
    setValue("payslipNumber", generatePayslipNumber());
  }, [setValue, generatePayslipNumber]);
  const onSubmit = async data => {
    // Add calculated net salary to the data
    data.netSalary = netSalary;
    console.log("Payroll data for submission:", data);

    // Submit to Supabase via our hook
    const result = await submitPayrollRecord(data);
    if (result.success) {
      // Reset the form
      reset({
        payslipNumber: generatePayslipNumber(),
        paymentDate: new Date().toISOString().split('T')[0],
        salaryPeriod: 'monthly',
        paymentStatus: 'pending'
      });

      // Clear other fields
      setValue("employeeName", "");
      setValue("employeeId", "");
      setValue("department", "");
      setValue("basicSalary", "");
      setValue("taxAmount", "0");
      setValue("nssfAmount", "0");
      setValue("loanDeduction", "0");
      setValue("otherDeductions", "0");
      setValue("currency", "UGX");
      setValue("paymentMethod", "bank_transfer");
      setValue("notes", "");
    }
  };
  if (viewMode === 'records') {
    return <PayrollPayslipsRecords onBack={() => setViewMode('form')} />;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => setViewMode('records')} className="flex items-center gap-2">
          <Eye className="h-4 w-4" /> View Records
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payroll & Payslips Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payslip Number</Label>
                <Input value={generatePayslipNumber()} readOnly className="bg-gray-50" {...register("payslipNumber")} />
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
            </div>

            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Amount</Label>
                  <Input type="number" step="0.01" defaultValue="0" {...register("taxAmount", {
                  min: {
                    value: 0,
                    message: "Amount cannot be negative"
                  }
                })} />
                  {errors.taxAmount && <p className="text-sm text-red-500">{errors.taxAmount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>NSSF Amount</Label>
                  <Input type="number" step="0.01" defaultValue="0" {...register("nssfAmount", {
                  min: {
                    value: 0,
                    message: "Amount cannot be negative"
                  }
                })} />
                  {errors.nssfAmount && <p className="text-sm text-red-500">{errors.nssfAmount.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Loan Deduction</Label>
                  <Input type="number" step="0.01" defaultValue="0" {...register("loanDeduction", {
                  min: {
                    value: 0,
                    message: "Amount cannot be negative"
                  }
                })} />
                  {errors.loanDeduction && <p className="text-sm text-red-500">{errors.loanDeduction.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Other Deductions</Label>
                  <Input type="number" step="0.01" defaultValue="0" {...register("otherDeductions", {
                  min: {
                    value: 0,
                    message: "Amount cannot be negative"
                  }
                })} />
                  {errors.otherDeductions && <p className="text-sm text-red-500">{errors.otherDeductions.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Net Salary (Auto-calculated)</Label>
              <Input type="number" value={netSalary.toFixed(2)} readOnly className="bg-gray-50 font-bold" />
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select defaultValue="pending" onValueChange={value => setValue("paymentStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Input type="hidden" {...register("paymentStatus")} />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select defaultValue="bank_transfer" onValueChange={value => setValue("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
              <Input type="hidden" {...register("paymentMethod", {
              value: "bank_transfer"
            })} />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register("notes")} placeholder="Additional notes (optional)" />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]" disabled={loading}>
                {loading ? "Processing..." : "Process Payroll"}
              </Button>
              
              <Button type="button" variant="outline" className="flex items-center gap-2" onClick={() => console.log("Generating bulk payroll...")}>
                <Users className="h-4 w-4" />
                Bulk Payroll Processing
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default PayrollPayslipsForm;