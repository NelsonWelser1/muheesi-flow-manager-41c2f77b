
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates and downloads a PDF with the provided data
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file without extension
 * @param {string} title - Title for the PDF document
 */
export const generateAndDownloadPDF = (data, fileName, title) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Extract headers from first data item
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const rows = data.map(item => Object.values(item));
    
    // Create table with autoTable plugin
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      theme: 'striped',
      headStyles: { 
        fillColor: [75, 93, 151],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 30 }, // Cattle
        2: { cellWidth: 20 }, // Type
        3: { cellWidth: 'auto' }, // Description
      }
    });
    
    // Save the PDF
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF report');
  }
};
