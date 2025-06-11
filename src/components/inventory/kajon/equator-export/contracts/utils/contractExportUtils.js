import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { toast } from "@/hooks/use-toast";
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const exportContractToPDF = async (element, filename) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable cross-origin image support
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF export error:", error);
    toast({
      title: "Error",
      description: "Failed to export PDF",
      variant: "destructive",
    });
  }
};

export const exportContractToJPG = async (element, filename) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable cross-origin image support
    });
    const imgData = canvas.toDataURL('image/jpeg');
    
    // Programmatically trigger a download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("JPG export error:", error);
    toast({
      title: "Error",
      description: "Failed to export JPG",
      variant: "destructive",
    });
  }
};

export const exportContractToExcel = async (element, contractData, filename) => {
  try {
    // Convert contract data to array of arrays
    const data = [
      ['Field', 'Value'], // Headers
      ...Object.entries(contractData).map(([key, value]) => [key, value]) // Data rows
    ];
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Contract Data');
    
    // Export the workbook to an Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error("Excel export error:", error);
    toast({
      title: "Error",
      description: "Failed to export Excel",
      variant: "destructive",
    });
  }
};
