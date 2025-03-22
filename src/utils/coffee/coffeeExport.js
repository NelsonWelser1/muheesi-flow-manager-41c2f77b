
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Helper to format date objects to readable strings
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Export data to CSV file
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Convert data to CSV format
  const header = Object.keys(data[0]);
  const csvRows = [
    header.join(','), // Header row
    ...data.map(row => 
      header.map(fieldName => {
        let field = row[fieldName];
        
        // Format date fields
        if (fieldName === 'created_at' && field) {
          field = formatDate(field);
        }
        
        // Handle arrays (like send_via)
        if (Array.isArray(field)) {
          field = field.join('; ');
        }
        
        // Escape commas and quotes
        if (typeof field === 'string') {
          field = field.replace(/"/g, '""');
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            field = `"${field}"`;
          }
        }
        
        return field || '';
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to Excel file
export const exportToExcel = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Process data for Excel formatting
  const processedData = data.map(item => {
    // Create a new object with the same properties
    const processedItem = { ...item };
    
    // Format date fields
    if (processedItem.created_at) {
      processedItem.created_at = formatDate(processedItem.created_at);
    }
    
    // Format array fields
    if (Array.isArray(processedItem.send_via)) {
      processedItem.send_via = processedItem.send_via.join(', ');
    }
    
    return processedItem;
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
  
  // Trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export data to PDF file
export const exportToPDF = (data, filename = 'export', title = 'Report') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Initialize PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Format data for PDF table
  const rows = data.map(item => {
    return [
      item.title || '',
      item.report_type || '',
      item.recipient_name || '',
      item.created_at ? formatDate(item.created_at) : '',
      Array.isArray(item.send_via) ? item.send_via.join(', ') : item.send_via || '',
      item.location || ''
    ];
  });
  
  // Create the table
  doc.autoTable({
    startY: 30,
    head: [['Title', 'Report Type', 'Recipient', 'Date Created', 'Send Via', 'Location']],
    body: rows,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { top: 30 }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};
