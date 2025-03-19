
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generatePayslipPDF } from '../../utils/pdfUtils';

const DownloadPayslipButton = ({ record, formatCurrency }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

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
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleDownloadPayslip}
      disabled={isDownloading}
      title="Download Payslip"
    >
      <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
    </Button>
  );
};

export default DownloadPayslipButton;
