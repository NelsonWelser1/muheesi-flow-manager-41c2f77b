
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { format } from 'date-fns';

const PayrollTable = ({ records, loading }) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleViewPayslip = (record) => {
    console.log("Viewing payslip:", record);
    // Implementation for viewing payslip details
  };

  const handleEmailPayslip = (record) => {
    console.log("Emailing payslip to employee:", record);
    // Implementation for emailing payslip
  };

  const handleDownloadPayslip = (record) => {
    console.log("Downloading payslip PDF:", record);
    // Implementation for downloading payslip as PDF
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
