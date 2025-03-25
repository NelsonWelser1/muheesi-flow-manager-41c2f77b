
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Export records to PDF
 */
export const exportToPDF = (records, fileName = 'export') => {
  if (!records || records.length === 0) {
    console.error('No records to export');
    return;
  }

  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Requisition Records', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 30);
    
    const formatFieldValue = (value) => {
      if (value === null || value === undefined) return '-';
      if (typeof value === 'string' && value.length > 30) return value.substring(0, 27) + '...';
      return value;
    };
    
    // Prepare table data
    const tableColumn = [
      'Requester', 
      'Department', 
      'Type', 
      'Description', 
      'Urgency', 
      'Status', 
      'Date'
    ];
    
    const tableRows = records.map(record => [
      formatFieldValue(record.requester_name),
      formatFieldValue(record.department),
      formatFieldValue(record.requisition_type),
      formatFieldValue(record.requisition_type === 'tools' ? record.tools_machinery : record.repairs),
      formatFieldValue(record.urgency_level),
      formatFieldValue(record.status),
      formatFieldValue(format(new Date(record.created_at), 'MMM dd, yyyy p'))
    ]);
    
    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Save the PDF
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

/**
 * Export records to Excel
 */
export const exportToExcel = (records, fileName = 'export') => {
  if (!records || records.length === 0) {
    console.error('No records to export');
    return;
  }

  try {
    // Format data for Excel
    const formattedData = records.map(record => ({
      'Requester': record.requester_name || '-',
      'Department': record.department || '-',
      'Type': record.requisition_type || '-',
      'Description': record.requisition_type === 'tools' ? (record.tools_machinery || '-') : (record.repairs || '-'),
      'Justification': record.justification || '-',
      'Urgency': record.urgency_level || '-',
      'Status': record.status || '-',
      'Date Submitted': format(new Date(record.created_at), 'MMM dd, yyyy p')
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requisitions');
    
    // Save the workbook
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

/**
 * Export records to CSV
 */
export const exportToCSV = (records, fileName = 'export') => {
  if (!records || records.length === 0) {
    console.error('No records to export');
    return;
  }

  try {
    // Format data for CSV
    const formattedData = records.map(record => ({
      'Requester': record.requester_name || '-',
      'Department': record.department || '-',
      'Type': record.requisition_type || '-',
      'Description': record.requisition_type === 'tools' ? (record.tools_machinery || '-') : (record.repairs || '-'),
      'Justification': record.justification || '-',
      'Urgency': record.urgency_level || '-',
      'Status': record.status || '-',
      'Date Submitted': format(new Date(record.created_at), 'MMM dd, yyyy p')
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requisitions');
    
    // Save as CSV
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};
