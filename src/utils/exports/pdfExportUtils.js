
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Formats date strings for display in exports
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

/**
 * Adds a header to the PDF document
 * @param {jsPDF} doc - The PDF document
 * @param {string} title - Document title
 * @param {number} startY - Starting Y position
 * @returns {number} The new Y position after adding the header
 */
export const addDocumentHeader = (doc, title, startY = 15) => {
  // Add title
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, startY);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, startY + 7);
  
  return startY + 15; // Return new Y position after header
};

/**
 * Creates a formatted PDF document with data in a table format
 * @param {Array} data - The data to include in the PDF
 * @param {string} filename - The filename for the PDF
 * @param {string} title - The title for the PDF
 * @param {Array} columns - Column headers (optional)
 * @param {Array} rows - Row data (optional)
 * @returns {jsPDF} The PDF document
 */
export const createPDF = (data, filename, title, columns = [], rows = []) => {
  if (!data || data.length === 0) {
    throw new Error('No data provided for PDF export');
  }
  
  // Create a new PDF document (landscape for data-heavy reports)
  const isLandscape = columns.length > 5;
  const doc = new jsPDF(isLandscape ? 'landscape' : 'portrait');
  
  // Add header
  let startY = addDocumentHeader(doc, title);
  
  // If columns and rows aren't provided, generate them from the data
  if (!columns.length) {
    columns = Object.keys(data[0]).map(key => 
      key.split('_')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ')
    );
  }
  
  if (!rows.length) {
    rows = data.map(item => 
      columns.map(header => {
        const key = header.toLowerCase().replace(/ /g, '_');
        let value = item[key];
        
        // Format dates
        if (key.includes('date') || key.includes('time') || key === 'created_at' || key === 'updated_at') {
          value = formatDate(value);
        }
        
        // Format arrays
        if (Array.isArray(value)) {
          value = value.join(', ');
        }
        
        // Format booleans
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        }
        
        return value !== undefined && value !== null ? value : '';
      })
    );
  }
  
  // Add table using autoTable
  doc.autoTable({
    head: [columns],
    body: rows,
    startY,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255]
    },
    margin: { top: startY },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'auto',
      fontSize: 8
    }
  });
  
  // Add pagination
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount}`, 
      doc.internal.pageSize.width / 2, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
  }
  
  return doc;
};

/**
 * Generates and downloads a PDF file
 * @param {Array} data - The data to include in the PDF
 * @param {string} filename - The filename for the PDF
 * @param {string} title - The title for the PDF
 * @param {Array} columns - Column headers (optional)
 * @param {Array} rows - Row data (optional)
 */
export const generateAndDownloadPDF = (data, filename, title, columns = [], rows = []) => {
  try {
    const doc = createPDF(data, filename, title, columns, rows);
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
