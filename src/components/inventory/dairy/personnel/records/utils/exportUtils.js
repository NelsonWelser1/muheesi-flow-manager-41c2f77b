
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
export const exportToPDF = (data, fileName = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(`${fileName.replace('_', ' ')}`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Add export date
  doc.text(`Exported on: ${format(new Date(), 'PPp')}`, 14, 30);
  
  // Format data for PDF
  const formattedData = data.map(record => {
    let formatted = {};
    
    // Handle different record types
    if (record.employee_id) {
      // Employee records
      formatted = [
        record.employee_id,
        record.job_title || '-',
        record.department || '-',
        formatDate(record.shift_start),
        formatDate(record.shift_end),
        record.performance_rating ? `${record.performance_rating}/5` : '-',
        formatDate(record.review_date_time),
        record.status || 'Unknown'
      ];
    } else if (record.candidate_name) {
      // Recruitment records
      formatted = [
        record.candidate_name,
        record.job_title || '-',
        formatDate(record.interview_date_time),
        record.feedback || '-',
        record.status || 'Pending'
      ];
    } else if (record.employee_id && record.training_module) {
      // Training records
      formatted = [
        record.employee_id,
        record.training_module || '-',
        formatDate(record.training_date),
        record.performance_rating ? `${record.performance_rating}/5` : '-',
        record.feedback || '-'
      ];
    } else {
      // Generic fallback
      formatted = Object.values(record);
    }
    
    return formatted;
  });
  
  // Define columns based on record type
  let columns;
  if (data[0].employee_id && !data[0].training_module) {
    // Employee records
    columns = [
      'Employee ID', 'Job Title', 'Department', 'Shift Start', 
      'Shift End', 'Performance', 'Review Date', 'Status'
    ];
  } else if (data[0].candidate_name) {
    // Recruitment records
    columns = [
      'Candidate Name', 'Job Title', 'Interview Date', 'Feedback', 'Status'
    ];
  } else if (data[0].employee_id && data[0].training_module) {
    // Training records
    columns = [
      'Employee ID', 'Training Module', 'Training Date', 'Performance Rating', 'Feedback'
    ];
  } else {
    // Generic fallback
    columns = Object.keys(data[0]);
  }

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
export const exportToExcel = (data, fileName = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Format dates for better readability in Excel
  const formattedData = data.map(record => {
    const newRecord = { ...record };
    
    // Format dates for specific types
    if (newRecord.shift_start) newRecord.shift_start = formatDate(newRecord.shift_start);
    if (newRecord.shift_end) newRecord.shift_end = formatDate(newRecord.shift_end);
    if (newRecord.review_date_time) newRecord.review_date_time = formatDate(newRecord.review_date_time);
    if (newRecord.interview_date_time) newRecord.interview_date_time = formatDate(newRecord.interview_date_time);
    if (newRecord.training_date) newRecord.training_date = formatDate(newRecord.training_date);
    if (newRecord.created_at) newRecord.created_at = formatDate(newRecord.created_at);
    
    return newRecord;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Export to Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Export to CSV
export const exportToCSV = (data, fileName = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Format dates for better readability in CSV
  const formattedData = data.map(record => {
    const newRecord = { ...record };
    
    // Format dates for specific types
    if (newRecord.shift_start) newRecord.shift_start = formatDate(newRecord.shift_start);
    if (newRecord.shift_end) newRecord.shift_end = formatDate(newRecord.shift_end);
    if (newRecord.review_date_time) newRecord.review_date_time = formatDate(newRecord.review_date_time);
    if (newRecord.interview_date_time) newRecord.interview_date_time = formatDate(newRecord.interview_date_time);
    if (newRecord.training_date) newRecord.training_date = formatDate(newRecord.training_date);
    if (newRecord.created_at) newRecord.created_at = formatDate(newRecord.created_at);
    
    return newRecord;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Export to CSV file
  XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
};
