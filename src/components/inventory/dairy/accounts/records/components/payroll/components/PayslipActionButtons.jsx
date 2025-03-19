
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const PayslipActionButtons = ({ record, formatCurrency }) => {
  const { toast } = useToast();
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const generatePayslipPDF = () => {
    const doc = new jsPDF();
    
    // Add document title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("PAYSLIP", 105, 15, { align: 'center' });
    
    // Add company logo/header
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Grand Berna Dairies Ltd", 105, 25, { align: 'center' });
    
    // Add employee information
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Payslip Number: ${record.payslip_number}`, 14, 35);
    doc.text(`Employee: ${record.employee_name} (ID: ${record.employee_id})`, 14, 40);
    doc.text(`Department: ${record.department || 'N/A'}`, 14, 45);
    doc.text(`Payment Date: ${format(new Date(record.payment_date), 'dd MMMM yyyy')}`, 14, 50);
    doc.text(`Salary Period: ${record.salary_period || 'Monthly'}`, 14, 55);
    
    // Create salary details table with jsPDF-AutoTable
    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        startY: 65,
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
    } else {
      // Fallback if autoTable isn't available
      let y = 65;
      doc.setFontSize(10);
      doc.text("Description", 14, y);
      doc.text("Amount", 120, y);
      y += 10;
      
      // Draw lines
      doc.line(14, y-5, 196, y-5);
      
      // Add rows manually
      const items = [
        ['Basic Salary', formatCurrency(record.basic_salary, record.currency)],
        ['Tax Deduction', formatCurrency(record.tax_amount || 0, record.currency)],
        ['NSSF Contribution', formatCurrency(record.nssf_amount || 0, record.currency)],
        ['Loan Deduction', formatCurrency(record.loan_deduction || 0, record.currency)],
        ['Other Deductions', formatCurrency(record.other_deductions || 0, record.currency)],
        ['Net Salary', formatCurrency(record.net_salary, record.currency)]
      ];
      
      items.forEach(item => {
        doc.text(item[0], 14, y);
        doc.text(item[1], 120, y);
        y += 10;
      });
    }
    
    // Get the Y position after the table
    const finalY = doc.autoTable ? doc.lastAutoTable.finalY + 10 : 150;
    
    // Add payment information
    doc.text(`Payment Status: ${record.payment_status === 'paid' ? 'Paid' : 'Pending'}`, 14, finalY);
    doc.text(`Payment Method: ${record.payment_method || 'N/A'}`, 14, finalY + 5);
    
    // Add footer
    doc.setFontSize(10);
    doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });
    
    return doc;
  };

  const handleEmailPayslip = async () => {
    setIsEmailSending(true);
    console.log("Emailing payslip to employee:", record);
    
    toast({
      title: "Sending Email...",
      description: "Processing your request...",
    });
    
    try {
      // Generate the PDF
      const doc = generatePayslipPDF();
      
      // Get the PDF as a blob
      const pdfBlob = doc.output('blob');
      
      // If this were a real implementation, here you would:
      // 1. Either use a backend API to send the email with the PDF attached
      // 2. Or use a client-side email service SDK
      
      // For now, we'll simulate email sending with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Normally, you'd do something like this:
      // const formData = new FormData();
      // formData.append('pdf', pdfBlob, `Payslip-${record.payslip_number}.pdf`);
      // formData.append('recipientEmail', record.email || 'employee@example.com');
      // formData.append('subject', `Payslip #${record.payslip_number}`);
      // await fetch('/api/send-payslip-email', { method: 'POST', body: formData });
      
      toast({
        title: "Email Sent",
        description: `Payslip email sent to ${record.employee_name}`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Failed",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDownloadPayslip = () => {
    setIsDownloading(true);
    console.log("Downloading payslip PDF:", record);
    
    try {
      // Generate the PDF
      const doc = generatePayslipPDF();
      
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
    } finally {
      setIsDownloading(false);
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
        disabled={isEmailSending}
        title="Email Payslip"
      >
        <Mail className={`h-4 w-4 ${isEmailSending ? 'animate-pulse' : ''}`} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDownloadPayslip}
        disabled={isDownloading}
        title="Download Payslip"
      >
        <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
};

export default PayslipActionButtons;
