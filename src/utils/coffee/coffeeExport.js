import { exportHealthRecordsToPDF, exportHealthRecordsToExcel, exportHealthRecordsToCSV } from "../health/healthRecordExports";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Exports data to PDF format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename for the exported file
 * @param {string} type - The type of data being exported
 */
export const exportToPDF = (data, filename, type) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  // Handle different export types
  if (type === 'Health Records') {
    return exportHealthRecordsToPDF(data, filename);
  }
  
  // Default PDF export handling
  const doc = new jsPDF();
  doc.text("Exported Data", 10, 10);
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(item => Object.values(item)),
  });
  doc.save(`${filename}.pdf`);
};

/**
 * Exports data to Excel format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename for the exported file
 * @param {string} type - The type of data being exported
 */
export const exportToExcel = (data, filename, type) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  // Handle different export types
  if (type === 'Health Records') {
    return exportHealthRecordsToExcel(data, filename);
  }
  
  // Default Excel export handling
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Exports data to CSV format
 * @param {Array} data - The data to export
 * @param {string} filename - The filename for the exported file
 * @param {string} type - The type of data being exported
 */
export const exportToCSV = (data, filename, type) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  // Handle different export types
  if (type === 'Health Records') {
    return exportHealthRecordsToCSV(data, filename);
  }
  
  // Default CSV export handling
  const csv = XLSX.utils.json_to_csv(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
