
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const PayslipActionButtons = ({ record, formatCurrency }) => {
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

  const handleEmailPayslip = () => {
    console.log("Emailing payslip to employee:", record);
    
    toast({
      title: "Sending Email...",
      description: "Processing your request...",
    });
    
    // Simulate email sending with a timeout
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Payslip email sent to ${record.employee_name}`,
      });
    }, 1000);
  };

  const handleDownloadPayslip = () => {
    console.log("Downloading payslip PDF:", record);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add document title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("PAYSLIP", 105, 15, { align: 'center' });
      
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

  return (
    <div className="flex space-x-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleViewPayslip}
        title="View Payslip"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleEmailPayslip}
        title="Email Payslip"
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDownloadPayslip}
        title="Download Payslip"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PayslipActionButtons;
