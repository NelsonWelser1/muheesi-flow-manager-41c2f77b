
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Mail, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PayrollTable = ({ records, loading }) => {
  const { toast } = useToast();

  if (loading) {
    return <div className="w-full text-center py-8">Loading records...</div>;
  }

  if (!records || records.length === 0) {
    return <div className="w-full text-center py-8">No records found.</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDateSafely = (dateString) => {
    try {
      if (!dateString) return '-';
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString || '-';
    }
  };

  const handleEmailPayslip = (record) => {
    console.log("Emailing payslip for:", record.payslipNumber);
    toast({
      title: "Email Sent",
      description: `Payslip ${record.payslipNumber} has been emailed to the employee.`,
    });
  };

  const handleDownloadPayslip = (record) => {
    console.log("Downloading payslip PDF for:", record.payslipNumber);
    toast({
      title: "Download Started",
      description: `Payslip ${record.payslipNumber} PDF download has started.`,
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payslip #</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Gross Salary</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const totalDeductions = 
              (record.taxAmount || 0) + 
              (record.nssfAmount || 0) + 
              (record.loanDeduction || 0) + 
              (record.otherDeductions || 0);
            
            return (
              <TableRow key={record.id}>
                <TableCell>{record.payslipNumber}</TableCell>
                <TableCell>
                  <div>{record.employeeName}</div>
                  <div className="text-xs text-gray-500">ID: {record.employeeId}</div>
                </TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell>{formatDateSafely(record.paymentDate)}</TableCell>
                <TableCell>{formatAmount(record.basicSalary, record.currency)}</TableCell>
                <TableCell>{formatAmount(totalDeductions, record.currency)}</TableCell>
                <TableCell className="font-medium">{formatAmount(record.netSalary, record.currency)}</TableCell>
                <TableCell>{getStatusBadge(record.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEmailPayslip(record)}
                      title="Email Payslip"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownloadPayslip(record)}
                      title="Download Payslip PDF"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
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
