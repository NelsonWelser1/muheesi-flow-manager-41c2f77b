
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const usePayrollPayslips = () => {
  const [loading, setLoading] = useState(false);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const { toast } = useToast();
  
  // Fetch all payroll records
  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      console.log('Fetching payroll records from Supabase...');
      
      const { data, error } = await supabase
        .from('payroll_payslips')
        .select('*')
        .order('payment_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching payroll records:', error);
        toast({
          title: "Error",
          description: `Failed to fetch payroll records: ${error.message}`,
          variant: "destructive",
        });
        return [];
      }
      
      console.log('Payroll records fetched successfully:', data);
      setPayrollRecords(data || []);
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching payroll records:', err);
      toast({
        title: "Error",
        description: `Unexpected error: ${err.message}`,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Submit payroll record to Supabase
  const submitPayrollRecord = async (payrollData) => {
    try {
      setLoading(true);
      console.log("Payroll data to be saved to Supabase:", payrollData);
      
      // Convert field names to snake_case for database
      const dbPayrollData = {
        payslip_number: payrollData.payslipNumber,
        employee_name: payrollData.employeeName,
        employee_id: payrollData.employeeId,
        department: payrollData.department,
        salary_period: payrollData.salaryPeriod,
        payment_date: payrollData.paymentDate,
        basic_salary: parseFloat(payrollData.basicSalary),
        tax_amount: parseFloat(payrollData.taxAmount || 0),
        nssf_amount: parseFloat(payrollData.nssfAmount || 0),
        loan_deduction: parseFloat(payrollData.loanDeduction || 0),
        other_deductions: parseFloat(payrollData.otherDeductions || 0),
        net_salary: parseFloat(payrollData.netSalary),
        currency: payrollData.currency,
        payment_status: payrollData.paymentStatus,
        payment_method: payrollData.paymentMethod,
        notes: payrollData.notes
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('payroll_payslips')
        .insert([dbPayrollData])
        .select();
      
      if (error) {
        console.error("Error creating payroll record:", error);
        toast({
          title: "Error",
          description: `Failed to create payroll record: ${error.message}`,
          variant: "destructive",
        });
        return { success: false, data: null };
      }
      
      console.log("Payroll record saved successfully:", data);
      
      toast({
        title: "Success",
        description: "Payroll record created successfully",
      });
      
      // Refresh the records list
      await fetchPayrollRecords();
      
      return { success: true, data };
    } catch (error) {
      console.error("Error creating payroll record:", error);
      toast({
        title: "Error",
        description: `Failed to create payroll record: ${error.message}`,
        variant: "destructive",
      });
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Generate a new payslip number
  const generatePayslipNumber = () => {
    const prefix = "PAY";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };

  return {
    payrollRecords,
    loading,
    fetchPayrollRecords,
    submitPayrollRecord,
    generatePayslipNumber
  };
};
