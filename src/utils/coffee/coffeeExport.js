import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export coffee stock data to CSV format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToCSV = (data, filename = 'coffee-stock-export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to CSV');
    return;
  }

  try {
    // Get headers from the first item
    const headers = Object.keys(data[0]);
    
    // Format data rows
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that need quotes (contain commas, quotes, or newlines)
          const formatted = value === null || value === undefined ? '' : String(value);
          return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n') 
            ? `"${formatted.replace(/"/g, '""')}"` 
            : formatted;
        }).join(',')
      )
    ];
    
    // Create CSV content and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`CSV export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Export coffee stock data to Excel format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToExcel = (data, filename = 'coffee-stock-export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to Excel');
    return;
  }

  try {
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coffee Stock');
    
    // Generate Excel file and trigger browser download
    XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    console.log(`Excel export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again later.');
  }
};

/**
 * Export coffee stock data to PDF format
 * @param {Array} data - Coffee stock entries
 * @param {string} filename - Output filename
 */
export const exportToPDF = (data, filename = 'coffee-stock-export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export to PDF');
    return;
  }

  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Coffee Stock Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Select relevant columns for the PDF (to keep it readable)
    const columns = [
      'coffee_type',
      'quality_grade',
      'quantity',
      'buying_price',
      'location',
      'status',
      'created_at'
    ];
    
    // Format data for autoTable
    const tableData = data.map(item => {
      const rowData = [];
      columns.forEach(col => {
        let value = item[col];
        
        // Format date
        if (col === 'created_at' && value) {
          try {
            value = new Date(value).toLocaleDateString();
          } catch (e) {
            // Keep original value if date parsing fails
          }
        }
        
        rowData.push(value || 'N/A');
      });
      return rowData;
    });
    
    // Generate table headers in Title Case
    const headers = columns.map(col => 
      col.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
    
    // Add table to PDF
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 135, 245], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 25 }
    });
    
    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    console.log(`PDF export of ${data.length} records completed`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export to PDF. Please try again later.');
  }
};
