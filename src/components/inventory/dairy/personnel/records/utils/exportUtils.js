
import { utils, writeFileXLSX } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'PPp');
  } catch (error) {
    return dateString;
  }
};

// Export to PDF
export const exportToPDF = (records, fileName = 'records') => {
  const doc = new jsPDF();
  
  // Define table columns
  const columns = [
    { header: 'Candidate Name', dataKey: 'candidate_name' },
    { header: 'Job Title', dataKey: 'job_title' },
    { header: 'Interview Date', dataKey: 'interview_date_time' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Hiring Manager', dataKey: 'hiring_manager_id' },
  ];
  
  // Format data for the table
  const tableData = records.map(record => ({
    ...record,
    interview_date_time: formatDate(record.interview_date_time),
    created_at: formatDate(record.created_at)
  }));
  
  // Add title
  doc.setFontSize(16);
  doc.text('Recruitment Records', 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 22);
  
  // Create table
  doc.autoTable({
    columns,
    body: tableData,
    startY: 30,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 135, 245], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

// Export to Excel
export const exportToExcel = (records, fileName = 'records') => {
  // Format data
  const formattedData = records.map(record => ({
    'Candidate Name': record.candidate_name,
    'Job Title': record.job_title,
    'Interview Date/Time': formatDate(record.interview_date_time),
    'Hiring Manager': record.hiring_manager_id,
    'Status': record.status,
    'Feedback': record.feedback,
    'Created At': formatDate(record.created_at)
  }));
  
  // Create worksheet
  const ws = utils.json_to_sheet(formattedData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Records');
  
  // Generate Excel file
  writeFileXLSX(wb, `${fileName}.xlsx`);
};

// Export to CSV
export const exportToCSV = (records, fileName = 'records') => {
  // Format data
  const formattedData = records.map(record => ({
    'Candidate Name': record.candidate_name,
    'Job Title': record.job_title,
    'Interview Date/Time': formatDate(record.interview_date_time),
    'Hiring Manager': record.hiring_manager_id,
    'Status': record.status,
    'Feedback': record.feedback,
    'Created At': formatDate(record.created_at)
  }));
  
  // Convert to CSV string
  const headers = Object.keys(formattedData[0]);
  let csvContent = headers.join(',') + '\n';
  
  formattedData.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap with quotes if contains comma
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvContent += values.join(',') + '\n';
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
