
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const ViewPayslipButton = ({ record, formatCurrency }) => {
  const { toast } = useToast();

  const handleViewPayslip = () => {
    console.log("Viewing payslip:", record);
    
    // Create a simple payslip view in an alert dialog
    const payslipContent = `
      Payslip #: ${record.payslip_number}
      Employee: ${record.employee_name} (ID: ${record.employee_id})
      Date: ${format(new Date(record.payment_date), 'dd MMM yyyy')}
      Department: ${record.department || 'N/A'}
      
      Basic Salary: ${formatCurrency(record.basic_salary, record.currency)}
      Tax: ${formatCurrency(record.tax_amount || 0, record.currency)}
      NSSF: ${formatCurrency(record.nssf_amount || 0, record.currency)}
      Loan Deduction: ${formatCurrency(record.loan_deduction || 0, record.currency)}
      Other Deductions: ${formatCurrency(record.other_deductions || 0, record.currency)}
      
      Net Salary: ${formatCurrency(record.net_salary, record.currency)}
      
      Payment Status: ${record.payment_status === 'paid' ? 'Paid' : 'Pending'}
      Payment Method: ${record.payment_method || 'N/A'}
    `;
    
    alert(payslipContent);
    
    toast({
      title: "Payslip Viewed",
      description: `Viewing payslip for ${record.employee_name}`,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleViewPayslip}
      title="View Payslip"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
};

export default ViewPayslipButton;
