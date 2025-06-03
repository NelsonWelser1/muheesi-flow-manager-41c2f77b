
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'PPp');
  } catch (error) {
    return dateString;
  }
};

// Export to PDF
export const exportToPDF = (data, fileName = 'employee_dossiers') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Employee Dossiers Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Add export date
  doc.text(`Exported on: ${format(new Date(), 'PPp')}`, 14, 30);
  
  // Format data for PDF
  const formattedData = data.map(dossier => [
    dossier.employee_id || '-',
    dossier.job_title || '-',
    dossier.department || '-',
    dossier.status || '-',
    dossier.performance_rating ? `${dossier.performance_rating}/5` : '-',
    formatDate(dossier.created_at)
  ]);
  
  const columns = [
    'Employee ID', 'Job Title', 'Department', 'Status', 'Performance', 'Created At'
  ];

  // Generate the table
  doc.autoTable({
    head: [columns],
    body: formattedData,
    startY: 40,
    margin: { horizontal: 14 },
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, fileName = 'employee_dossiers') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Format dates for better readability in Excel
  const formattedData = data.map(dossier => {
    const newRecord = { ...dossier };
    
    if (newRecord.created_at) newRecord.created_at = formatDate(newRecord.created_at);
    if (newRecord.updated_at) newRecord.updated_at = formatDate(newRecord.updated_at);
    if (newRecord.shift_start) newRecord.shift_start = formatDate(newRecord.shift_start);
    if (newRecord.shift_end) newRecord.shift_end = formatDate(newRecord.shift_end);
    if (newRecord.review_date_time) newRecord.review_date_time = formatDate(newRecord.review_date_time);
    
    return newRecord;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Dossiers');
  
  // Export to Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Export to CSV
export const exportToCSV = (data, fileName = 'employee_dossiers') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Format dates for better readability in CSV
  const formattedData = data.map(dossier => {
    const newRecord = { ...dossier };
    
    if (newRecord.created_at) newRecord.created_at = formatDate(newRecord.created_at);
    if (newRecord.updated_at) newRecord.updated_at = formatDate(newRecord.updated_at);
    if (newRecord.shift_start) newRecord.shift_start = formatDate(newRecord.shift_start);
    if (newRecord.shift_end) newRecord.shift_end = formatDate(newRecord.shift_end);
    if (newRecord.review_date_time) newRecord.review_date_time = formatDate(newRecord.review_date_time);
    
    return newRecord;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Dossiers');
  
  // Export to CSV file
  XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
};
