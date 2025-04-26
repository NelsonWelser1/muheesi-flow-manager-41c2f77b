
import { generateAndDownloadPDF } from "@/utils/exports/pdfExportUtils";
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Formats health records for export
 * @param {Array} records - The health records to format
 * @returns {Array} Formatted health records
 */
export const formatHealthRecordsForExport = (records) => {
  return records.map(record => ({
    'Date': record.record_date ? format(new Date(record.record_date), 'MMM dd, yyyy') : '',
    'Cattle Tag': record.cattle_inventory?.tag_number || '',
    'Cattle Name': record.cattle_inventory?.name || '',
    'Record Type': record.record_type ? record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1) : '',
    'Description': record.description || '',
    'Treatment': record.treatment || '',
    'Administered By': record.administered_by || '',
    'Next Due Date': record.next_due_date ? format(new Date(record.next_due_date), 'MMM dd, yyyy') : '',
    'Notes': record.notes || ''
  }));
};

/**
 * Exports health records to PDF
 * @param {Array} records - The health records to export
 * @param {string} filename - The filename for the exported PDF
 */
export const exportHealthRecordsToPDF = (records, filename = 'health_records') => {
  const formattedRecords = formatHealthRecordsForExport(records);
  
  // Define columns for the PDF
  const columns = [
    'Date',
    'Cattle Tag',
    'Cattle Name',
    'Record Type',
    'Description',
    'Treatment',
    'Administered By',
    'Next Due Date',
    'Notes'
  ];
  
  // Extract rows for the PDF
  const rows = formattedRecords.map(record => 
    columns.map(column => record[column] || '')
  );
  
  return generateAndDownloadPDF(
    formattedRecords, 
    filename, 
    'Cattle Health Records', 
    columns, 
    rows
  );
};

/**
 * Exports health records to Excel
 * @param {Array} records - The health records to export
 * @param {string} filename - The filename for the exported Excel file
 */
export const exportHealthRecordsToExcel = (records, filename = 'health_records') => {
  const formattedRecords = formatHealthRecordsForExport(records);
  
  const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Records');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
  
  return true;
};

/**
 * Exports health records to CSV
 * @param {Array} records - The health records to export
 * @param {string} filename - The filename for the exported CSV
 */
export const exportHealthRecordsToCSV = (records, filename = 'health_records') => {
  const formattedRecords = formatHealthRecordsForExport(records);
  
  const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
