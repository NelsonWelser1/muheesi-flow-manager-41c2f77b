
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ExcelExportButton from './export-buttons/ExcelExportButton';
import CSVExportButton from './export-buttons/CSVExportButton';
import PDFExportButton from './export-buttons/PDFExportButton';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { 
  exportToExcel, 
  exportToCSV, 
  exportToPDF,
  emailPayrollReport 
} from './utils/exportUtils';

const ExportActions = ({ filteredRecords }) => {
  const { toast } = useToast();
  const [isEmailSending, setIsEmailSending] = useState(false);

  const handleExcelExport = () => {
    exportToExcel(filteredRecords, toast);
  };

  const handleCSVExport = () => {
    exportToCSV(filteredRecords, toast);
  };

  const handlePDFExport = async () => {
    await exportToPDF(filteredRecords, toast);
  };
  
  const handleEmailReport = async () => {
    setIsEmailSending(true);
    try {
      // In a real application, you might prompt for the email address
      // For now, we'll use a default admin email
      const adminEmail = "admin@grandberna.com";
      await emailPayrollReport(filteredRecords, adminEmail, toast);
    } finally {
      setIsEmailSending(false);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <ExcelExportButton onClick={handleExcelExport} />
      <CSVExportButton onClick={handleCSVExport} />
      <PDFExportButton onClick={handlePDFExport} />
      <Button
        variant="outline"
        size="sm"
        onClick={handleEmailReport}
        disabled={isEmailSending}
        className="flex items-center gap-1"
        title="Email Payroll Report"
      >
        <Mail className={`h-4 w-4 ${isEmailSending ? 'animate-pulse' : ''}`} />
        Email
      </Button>
    </div>
  );
};

export default ExportActions;
