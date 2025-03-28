
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { generateAndDownloadPDF } from '@/utils/exports/pdfExportUtils';

/**
 * Utility class for PDF export operations specific to Kyalima Farmers Limited
 */
export class KyalimaPDFExport {
  /**
   * Export dashboard overview to PDF
   * @param {string} elementId - ID of the element to export
   */
  static exportDashboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    this.exportElementToPDF(element, 'Kyalima_Farmers_Dashboard', true);
  }

  /**
   * Export a table to PDF
   * @param {string} tableId - ID of the table element
   * @param {string} filename - Name for the exported file
   */
  static exportTableToPDF(tableId, filename = 'Kyalima_Export') {
    const table = document.getElementById(tableId);
    if (!table) {
      console.error('Table not found:', tableId);
      return;
    }

    this.exportElementToPDF(table, filename);
  }

  /**
   * Print content
   * @param {string} elementId - ID of the element to print
   */
  static printContent(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the document');
      return;
    }

    // Apply print styles
    printWindow.document.write(`
      <html>
        <head>
          <title>Kyalima Farmers Limited - Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .badge { 
              display: inline-block;
              padding: 0.25em 0.5em;
              font-size: 0.85em;
              font-weight: 500;
              border-radius: 9999px;
            }
            .badge-outline { border: 1px solid #666; }
            .badge-red { background-color: #fee2e2; color: #991b1b; }
            .badge-yellow { background-color: #fef3c7; color: #92400e; }
            .badge-green { background-color: #dcfce7; color: #166534; }
            @media print {
              body { margin: 0; padding: 20px; }
              button, .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  }

  /**
   * Print a specific table
   * @param {string} tableId - ID of the table to print
   */
  static printTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
      console.error('Table not found:', tableId);
      return;
    }

    this.printContent(tableId);
  }

  /**
   * Export an element to PDF
   * @param {HTMLElement} element - Element to export
   * @param {string} filename - Name for the exported file
   * @param {boolean} landscape - Whether to use landscape orientation
   */
  static async exportElementToPDF(element, filename = 'Kyalima_Export', landscape = false) {
    try {
      // Add a class to the body to apply print styles during capture
      document.body.classList.add('exporting-pdf');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      // Remove the class after capture
      document.body.classList.remove('exporting-pdf');
      
      const pdf = new jsPDF(landscape ? 'landscape' : 'portrait', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Kyalima Farmers Limited', 14, 15);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 22);
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 30) / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 30, imgWidth * ratio, imgHeight * ratio);
      
      // Add page numbers
      const pages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Page ${i} of ${pages}`,
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      pdf.save(`${filename}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  }

  /**
   * Export data to PDF using table format
   * @param {Array} data - Data array to export
   * @param {string} filename - Name for the exported file
   * @param {string} title - Title for the PDF document
   */
  static exportDataToPDF(data, filename, title) {
    return generateAndDownloadPDF(data, filename, title);
  }
}
