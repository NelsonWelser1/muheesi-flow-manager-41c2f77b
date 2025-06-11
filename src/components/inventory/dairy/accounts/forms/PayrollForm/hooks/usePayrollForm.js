
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { usePayrollPayslips } from '../../hooks/usePayrollPayslips';

export const usePayrollForm = () => {
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
  
  const { toast } = useToast();
  const {
    loading,
    submitPayrollRecord,
    generatePayslipNumber
  } = usePayrollPayslips();
  
  // Watch for changes in values to calculate net salary
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

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    loading,
    netSalary
  };
};
