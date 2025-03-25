
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

// Process requisition data for export
const processRequisitionData = (requisitions) => {
  return requisitions.map(req => ({
    'Requester': req.requester_name,
    'Department': req.department,
    'Type': req.requisition_type,
    'Urgency': req.urgency,
    'Status': req.status,
    'Created': formatDate(req.created_at),
    'Updated': formatDate(req.updated_at),
    'Justification': req.justification
  }));
};

// Export to CSV
export const exportToCSV = (requisitions, filename) => {
  if (!requisitions || requisitions.length === 0) return;
  
  const processedData = processRequisitionData(requisitions);
  
  // Create headers and rows
  const headers = Object.keys(processedData[0]);
  const rows = processedData.map(item => headers.map(header => item[header]));
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => 
      cell ? `"${String(cell).replace(/"/g, '""')}"` : ''
    ).join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to Excel
export const exportToExcel = (requisitions, filename) => {
  if (!requisitions || requisitions.length === 0) return;
  
  const processedData = processRequisitionData(requisitions);
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Requisitions');
  
  // Generate and download Excel file
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export to PDF
export const exportToPDF = (requisitions, title) => {
  if (!requisitions || requisitions.length === 0) return;
  
  const processedData = processRequisitionData(requisitions);
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Convert data for table
  const headers = Object.keys(processedData[0]);
  const rows = processedData.map(item => headers.map(header => item[header]));
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 25,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [71, 85, 119] }
  });
  
  // Save PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
