
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { useCurrencyFormatter } from "../../../../../forms/components/BulkPayrollTable/hooks/useCurrencyFormatter";

const PayrollTable = ({ records, loading }) => {
  const { toast } = useToast();
  const { formatCurrency } = useCurrencyFormatter();

  const handleViewPayslip = (record) => {
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

  const handleEmailPayslip = (record) => {
    console.log("Emailing payslip to employee:", record);
    
    // Simulate sending an email
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Payslip email sent to ${record.employee_name}`,
      });
    }, 1000);
  };

  const handleDownloadPayslip = (record) => {
    console.log("Downloading payslip PDF:", record);
    
    // Create a simple text representation of the payslip
    const payslipContent = `
PAYSLIP

Payslip Number: ${record.payslip_number}
Employee: ${record.employee_name}
Employee ID: ${record.employee_id}
Department: ${record.department || 'N/A'}
Payment Date: ${format(new Date(record.payment_date), 'dd MMMM yyyy')}

EARNINGS
Basic Salary: ${formatCurrency(record.basic_salary, record.currency)}

DEDUCTIONS
Tax: ${formatCurrency(record.tax_amount || 0, record.currency)}
NSSF: ${formatCurrency(record.nssf_amount || 0, record.currency)}
Loan: ${formatCurrency(record.loan_deduction || 0, record.currency)}
Other: ${formatCurrency(record.other_deductions || 0, record.currency)}

NET SALARY: ${formatCurrency(record.net_salary, record.currency)}

Payment Status: ${record.payment_status === 'paid' ? 'Paid' : 'Pending'}
Payment Method: ${record.payment_method || 'N/A'}
    `;
    
    // Create a Blob from the text content
    const blob = new Blob([payslipContent], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip-${record.payslip_number}.txt`;
    
    // Append to the document and click the link
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    toast({
      title: "Payslip Downloaded",
      description: `Downloaded payslip for ${record.employee_name}`,
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading payroll records...</div>;
  }

  if (records.length === 0) {
    return <div className="text-center p-8 text-gray-500">No payroll records found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payslip #</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map(record => {
            // Calculate total deductions
            const totalDeductions = 
              parseFloat(record.tax_amount || 0) + 
              parseFloat(record.nssf_amount || 0) + 
              parseFloat(record.loan_deduction || 0) + 
              parseFloat(record.other_deductions || 0);
            
            return (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.payslip_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{record.employee_name}</div>
                  <div className="text-xs text-gray-500">ID: {record.employee_id}</div>
                </TableCell>
                <TableCell>{format(new Date(record.payment_date), 'dd MMM yyyy')}</TableCell>
                <TableCell>{record.department || 'N/A'}</TableCell>
                <TableCell>{formatCurrency(record.basic_salary, record.currency)}</TableCell>
                <TableCell>{formatCurrency(totalDeductions, record.currency)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(record.net_salary, record.currency)}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    record.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewPayslip(record)}
                      title="View Payslip"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEmailPayslip(record)}
                      title="Email Payslip"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownloadPayslip(record)}
                      title="Download Payslip"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;
