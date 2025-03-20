
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'PPP');
};

// Helper function to prepare data for export
const prepareTrainingData = (records) => {
  return records.map(record => ({
    'Employee': record.employee_id,
    'Training Module': record.training_module,
    'Date': formatDate(record.training_date),
    'Rating': `${record.performance_rating}/5`,
    'Feedback': record.feedback || 'None'
  }));
};

// Export to PDF
export const exportToPDF = (records, fileName) => {
  const doc = new jsPDF();
  const formattedData = prepareTrainingData(records);
  
  // Add title
  doc.setFontSize(16);
  doc.text('Training & Performance Records', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPP pp')}`, 14, 22);
  
  // Create table with data
  autoTable(doc, {
    startY: 30,
    head: [Object.keys(formattedData[0])],
    body: formattedData.map(Object.values),
    theme: 'striped',
  });
  
  // Save the PDF
  doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Export to Excel
export const exportToExcel = (records, fileName) => {
  const formattedData = prepareTrainingData(records);
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Export to CSV
export const exportToCSV = (records, fileName) => {
  const formattedData = prepareTrainingData(records);
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Generate CSV and trigger download
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
