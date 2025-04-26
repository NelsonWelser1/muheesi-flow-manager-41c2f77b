
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Formats date strings for export files
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

/**
 * Process data for export based on data type
 * @param {Array} data - The data to process
 * @param {string} type - The type of data (optional)
 * @returns {Array} Processed data ready for export
 */
const processDataForExport = (data, type = '') => {
  // Health records specific processing
  if (type.includes('health')) {
    return data.map(record => ({
      'Date': record.record_date ? new Date(record.record_date).toLocaleDateString() : 'N/A',
      'Cattle': record.cattle_inventory ? `${record.cattle_inventory.tag_number || 'Unknown'} - ${record.cattle_inventory.name || 'Unnamed'}` : 'Unknown',
      'Type': record.record_type || 'N/A',
      'Description': record.description || 'N/A',
      'Treatment': record.treatment || 'N/A',
      'Administered By': record.administered_by || 'N/A',
      'Next Due Date': record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A',
      'Notes': record.notes || 'N/A'
    }));
  }
  
  // Generic processing for other data types
  return data.map(item => {
    const processedItem = {};
    
    Object.keys(item).forEach(key => {
      // Skip internal or complex fields
      if (key === 'id' || key === '_id' || typeof item[key] === 'object') {
        if (key === 'cattle_inventory' && item[key]) {
          processedItem['Cattle ID'] = item[key].tag_number || 'N/A';
          processedItem['Cattle Name'] = item[key].name || 'N/A';
        }
        return;
      }
      
      // Convert snake_case to Title Case for headers
      const header = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Format date fields
      if (key.includes('date') || key.includes('time') || key === 'created_at' || key === 'updated_at') {
        processedItem[header] = formatDate(item[key]);
      } else {
        processedItem[header] = item[key];
      }
    });
    
    return processedItem;
  });
};

/**
 * Exports data to Excel file
 * @param {Array} data - The data to export
 * @param {string} filename - The filename without extension
 * @param {string} type - The type of data (optional)
 */
export const exportToExcel = (data, filename, type = '') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  try {
    // Process data for export
    const processedData = processDataForExport(data, type);
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    // Generate filename with date
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const fullFilename = `${filename}_${dateStr}.xlsx`;
    
    // Save file
    XLSX.writeFile(workbook, fullFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Exports data to CSV file
 * @param {Array} data - The data to export
 * @param {string} filename - The filename without extension
 * @param {string} type - The type of data (optional)
 */
export const exportToCSV = (data, filename, type = '') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  try {
    // Process data for export
    const processedData = processDataForExport(data, type);
    
    // Get headers from first object
    const headers = Object.keys(processedData[0]);
    
    // Create CSV content with headers
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    processedData.forEach(item => {
      const row = headers.map(header => {
        // Handle values with commas by wrapping in quotes
        const value = item[header] ? String(item[header]).replace(/"/g, '""') : '';
        return `"${value}"`;
      }).join(',');
      csvContent += row + '\n';
    });
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate filename with date
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const fullFilename = `${filename}_${dateStr}.csv`;
    
    // Set up download
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};
