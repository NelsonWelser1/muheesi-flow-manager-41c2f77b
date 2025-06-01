
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { exportToPDF, exportToExcel, exportToCSV } from '@/components/inventory/dairy/utils/reportExportUtils';

export const useQualityChecksExport = () => {
  const { toast } = useToast();

  const handleExportPDF = (filteredChecks) => {
    try {
      exportToPDF(filteredChecks, 'Quality Control Checks', 'quality_checks');
      toast({
        title: "Export Successful",
        description: "PDF file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = (filteredChecks) => {
    try {
      exportToExcel(filteredChecks, 'Quality Control Checks', 'quality_checks');
      toast({
        title: "Export Successful",
        description: "Excel file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export Excel. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = (filteredChecks) => {
    try {
      exportToCSV(filteredChecks, 'Quality Control Checks', 'quality_checks');
      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('quality-checks-table');
    if (printContent) {
      const printableContent = `
        <html>
          <head>
            <title>Quality Control Checks</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; margin-bottom: 20px; }
              .header { margin-bottom: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Quality Control Checks</h1>
              <p>Generated on: ${format(new Date(), 'PPP')}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printableContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return {
    handleExportPDF,
    handleExportExcel,
    handleExportCSV,
    handlePrint
  };
};
