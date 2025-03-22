
/**
 * Utilities for exporting coffee sales data to different formats
 */
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to CSV format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename without extension
 */
export const exportToCSV = (data, filename) => {
  // Format data for CSV
  const formattedData = formatDataForExport(data);
  
  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Coffee Sales');
  
  // Export to CSV
  XLSX.writeFile(wb, `${filename}.csv`);
};

/**
 * Export data to Excel format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename without extension
 */
export const exportToExcel = (data, filename) => {
  // Format data for Excel
  const formattedData = formatDataForExport(data);
  
  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Coffee Sales');
  
  // Export to Excel
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export data to PDF format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename without extension
 * @param {string} title - The title for the PDF document
 */
export const exportToPDF = (data, filename, title) => {
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Format data for the table
  const formattedData = formatDataForExport(data);
  
  // Get table headers
  const headers = Object.keys(formattedData[0]);
  
  // Prepare table rows
  const rows = formattedData.map(record => Object.values(record));
  
  // Create table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [51, 51, 51], textColor: 255 },
    margin: { top: 30 }
  });
  
  // Save PDF
  doc.save(`${filename}.pdf`);
};

/**
 * Format data for export to make it more readable
 * @param {Array} data - The raw data to format
 * @returns {Array} - Formatted data
 */
const formatDataForExport = (data) => {
  return data.map(record => {
    // Get date in readable format
    const date = new Date(record.created_at).toLocaleString();
    
    // Format the data
    return {
      'Date': date,
      'Buyer Name': record.buyer_name,
      'Buyer Contact': record.buyer_contact,
      'Coffee Type': record.coffee_type,
      'Quality Grade': record.quality_grade,
      'Location': record.location,
      'Manager': record.manager,
      'Quantity': `${record.quantity} ${record.unit}`,
      'Selling Price': `${record.selling_price} ${record.currency}`,
      'Total Amount': `${record.total_price} ${record.currency}`,
      'Status': record.status
    };
  });
};
