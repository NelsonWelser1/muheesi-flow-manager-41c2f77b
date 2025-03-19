import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { useCurrencyFormatter } from "./hooks/useCurrencyFormatter";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

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
    
    // Create the email content
    const emailContent = `
Dear ${record.employee_name},

Your payslip for the current pay period is ready. Here are the details:

- Payslip Number: ${record.payslip_number}
- Payment Date: ${format(new Date(record.payment_date), 'dd MMMM yyyy')}
- Basic Salary: ${formatCurrency(record.basic_salary, record.currency)}
- Net Salary: ${formatCurrency(record.net_salary, record.currency)}

Please review the attached payslip for complete details.

Regards,
Grand Berna Dairies HR Department
    `;
    
    // In a real application, we would use a backend API to send this email
    // For now, we'll simulate an email being sent with a setTimeout
    toast({
      title: "Sending Email...",
      description: "Processing your request...",
    });
    
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Payslip email sent to ${record.employee_name}`,
      });
    }, 1500);
  };

  const handleDownloadPayslip = (record) => {
    console.log("Downloading payslip PDF:", record);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add document title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("PAYSLIP", 105, 15, { align: 'center' });
      
      // Add company logo (if we had one)
      // doc.addImage(companyLogo, 'PNG', 14, 10, 30, 30);
      
      // Add employee information
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Payslip Number: ${record.payslip_number}`, 14, 30);
      doc.text(`Employee: ${record.employee_name} (ID: ${record.employee_id})`, 14, 35);
      doc.text(`Department: ${record.department || 'N/A'}`, 14, 40);
      doc.text(`Payment Date: ${format(new Date(record.payment_date), 'dd MMMM yyyy')}`, 14, 45);
      
      // Create salary details table
      doc.autoTable({
        startY: 55,
        head: [['Description', 'Amount']],
        body: [
          ['Basic Salary', formatCurrency(record.basic_salary, record.currency)],
          ['Tax Deduction', formatCurrency(record.tax_amount || 0, record.currency)],
          ['NSSF Contribution', formatCurrency(record.nssf_amount || 0, record.currency)],
          ['Loan Deduction', formatCurrency(record.loan_deduction || 0, record.currency)],
          ['Other Deductions', formatCurrency(record.other_deductions || 0, record.currency)],
          ['Net Salary', formatCurrency(record.net_salary, record.currency)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105], textColor: 255 },
        footStyles: { fillColor: [245, 245, 245], textColor: [100, 100, 100] }
      });
      
      // Add payment information
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Payment Status: ${record.payment_status === 'paid' ? 'Paid' : 'Pending'}`, 14, finalY);
      doc.text(`Payment Method: ${record.payment_method || 'N/A'}`, 14, finalY + 5);
      
      // Add footer
      doc.setFontSize(10);
      doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });
      
      // Save the PDF
      doc.save(`Payslip-${record.payslip_number}.pdf`);
      
      toast({
        title: "Payslip Downloaded",
        description: `Downloaded payslip for ${record.employee_name}`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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
