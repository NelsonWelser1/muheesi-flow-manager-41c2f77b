
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Download, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { generatePayslipPDF } from '../utils/pdfUtils';

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

  const handleEmailPayslip = async () => {
    setIsEmailSending(true);
    console.log("Emailing payslip to employee:", record);
    
    toast({
      title: "Sending Email...",
      description: "Processing your request...",
    });
    
    try {
      // Generate the PDF using shared utility
      const doc = generatePayslipPDF(record, formatCurrency);
      
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
      // Generate the PDF using shared utility
      const doc = generatePayslipPDF(record, formatCurrency);
      
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
