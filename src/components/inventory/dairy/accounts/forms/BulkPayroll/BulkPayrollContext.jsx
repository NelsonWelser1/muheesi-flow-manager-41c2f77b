
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { usePayrollPayslips } from '../hooks/usePayrollPayslips';

// Create context
const BulkPayrollContext = createContext(null);

// Custom hook to use the context
export const useBulkPayroll = () => {
  const context = useContext(BulkPayrollContext);
  if (!context) {
    throw new Error('useBulkPayroll must be used within a BulkPayrollProvider');
  }
  return context;
};

// Provider component
export const BulkPayrollProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("import");
  const [employeeRecords, setEmployeeRecords] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const { toast } = useToast();
  const { submitPayrollRecord, generatePayslipNumber } = usePayrollPayslips();

  // Calculate net salary based on basic salary and deductions
  const calculateNetSalary = (employee) => {
    const basicSalary = parseFloat(employee.basicSalary) || 0;
    const taxAmount = parseFloat(employee.taxAmount) || 0;
    const nssfAmount = parseFloat(employee.nssfAmount) || 0;
    const loanDeduction = parseFloat(employee.loanDeduction) || 0;
    const otherDeductions = parseFloat(employee.otherDeductions) || 0;
    
    const totalDeductions = taxAmount + nssfAmount + loanDeduction + otherDeductions;
    return basicSalary - totalDeductions;
  };

  // Handle imported employees data
  const handleEmployeesImported = (employees) => {
    // Add payslip number and default values to each employee
    const enrichedEmployees = employees.map(emp => ({
      ...emp,
      payslipNumber: generatePayslipNumber(),
      paymentDate: new Date().toISOString().split('T')[0],
      salaryPeriod: emp.salaryPeriod || 'monthly',
      paymentStatus: 'pending',
      currency: emp.currency || 'UGX',
      paymentMethod: emp.paymentMethod || 'bank_transfer',
      taxAmount: emp.taxAmount || 0,
      nssfAmount: emp.nssfAmount || 0,
      loanDeduction: emp.loanDeduction || 0,
      otherDeductions: emp.otherDeductions || 0,
      netSalary: calculateNetSalary(emp)
    }));
    
    setEmployeeRecords(enrichedEmployees);
    setImportedCount(enrichedEmployees.length);
    setActiveTab("review");
    
    toast({
      title: "Data Imported",
      description: `${enrichedEmployees.length} employee records ready for review`,
    });
  };

  // Handle updates to employee records in the table
  const handleUpdateEmployeeData = (updatedRecords) => {
    // Recalculate net salary for all records
    const recalculatedRecords = updatedRecords.map(emp => ({
      ...emp,
      netSalary: calculateNetSalary(emp)
    }));
    
    setEmployeeRecords(recalculatedRecords);
  };

  // Process all payroll records
  const handleProcessPayroll = async () => {
    if (employeeRecords.length === 0) {
      toast({
        title: "No Records",
        description: "There are no employee records to process",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    let successfulSubmissions = 0;
    
    try {
      // Process records one by one
      for (const record of employeeRecords) {
        const result = await submitPayrollRecord(record);
        if (result.success) {
          successfulSubmissions++;
        }
      }
      
      setSuccessCount(successfulSubmissions);
      
      toast({
        title: "Payroll Processing Complete",
        description: `Successfully processed ${successfulSubmissions} of ${employeeRecords.length} payroll records`,
      });
      
      if (successfulSubmissions === employeeRecords.length) {
        setActiveTab("complete");
      } else {
        toast({
          title: "Warning",
          description: `${employeeRecords.length - successfulSubmissions} records failed to process`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Bulk payroll processing error:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred during payroll processing",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Reset state
  const resetState = () => {
    setEmployeeRecords([]);
    setActiveTab("import");
    setImportedCount(0);
    setSuccessCount(0);
  };

  const value = {
    activeTab,
    setActiveTab,
    employeeRecords,
    setEmployeeRecords,
    processing,
    setProcessing,
    importedCount,
    successCount,
    handleEmployeesImported,
    handleUpdateEmployeeData,
    handleProcessPayroll,
    resetState,
    calculateNetSalary
  };

  return (
    <BulkPayrollContext.Provider value={value}>
      {children}
    </BulkPayrollContext.Provider>
  );
};
