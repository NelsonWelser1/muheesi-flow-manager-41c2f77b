
import { generatePayrollReportPDF } from '../pdfUtils';

/**
 * Exports payroll records to PDF format
 * @param {Array} filteredRecords - Array of payroll records
 * @param {Function} toast - Toast notification function
 * @returns {Promise<jsPDF>} The generated PDF document
 */
export const exportToPDF = async (filteredRecords, toast) => {
  try {
    // Using our shared utility function to generate the PDF
    const doc = generatePayrollReportPDF(filteredRecords);
    
    // Save the PDF
    doc.save('payroll-payslips.pdf');
    
    toast({
      title: "Export Successful",
      description: "PDF file has been downloaded successfully."
    });
    
    return doc; // Return the doc object for potential emailing
  } catch (error) {
    console.error("PDF generation error:", error);
    toast({
      title: "Export Failed",
      description: "There was an error generating the PDF. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
