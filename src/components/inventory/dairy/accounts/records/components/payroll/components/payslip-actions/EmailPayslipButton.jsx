
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generatePayslipPDF } from '../../utils/pdfUtils';

const EmailPayslipButton = ({ record, formatCurrency }) => {
  const { toast } = useToast();
  const [isEmailSending, setIsEmailSending] = useState(false);

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

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleEmailPayslip}
      disabled={isEmailSending}
      title="Email Payslip"
    >
      <Mail className={`h-4 w-4 ${isEmailSending ? 'animate-pulse' : ''}`} />
    </Button>
  );
};

export default EmailPayslipButton;
