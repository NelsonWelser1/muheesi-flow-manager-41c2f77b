
import * as XLSX from 'xlsx';

/**
 * Exports data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file without extension
 */
export const exportToExcel = (data, fileName) => {
  try {
    // Format data for Excel
    const formattedData = data.map(record => ({
      "Date": record.record_date ? new Date(record.record_date).toLocaleDateString() : 'N/A',
      "Tag #": record.cattle_inventory?.tag_number || 'N/A',
      "Name": record.cattle_inventory?.name || 'Unnamed',
      "Type": record.record_type ? record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1) : 'N/A',
      "Description": record.description || 'N/A',
      "Treatment": record.treatment || 'N/A',
      "Administered By": record.administered_by || 'N/A',
      "Next Due Date": record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A',
      "Notes": record.notes || 'N/A'
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Records');

    // Generate file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export data to Excel');
  }
};

/**
 * Exports data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file without extension
 */
export const exportToCSV = (data, fileName) => {
  try {
    // Format data for CSV
    const formattedData = data.map(record => ({
      "Date": record.record_date ? new Date(record.record_date).toLocaleDateString() : 'N/A',
      "Tag #": record.cattle_inventory?.tag_number || 'N/A',
      "Name": record.cattle_inventory?.name || 'Unnamed',
      "Type": record.record_type ? record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1) : 'N/A',
      "Description": record.description || 'N/A',
      "Treatment": record.treatment || 'N/A',
      "Administered By": record.administered_by || 'N/A',
      "Next Due Date": record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A',
      "Notes": record.notes || 'N/A'
    }));

    // Create worksheet and export
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export data to CSV');
  }
};
