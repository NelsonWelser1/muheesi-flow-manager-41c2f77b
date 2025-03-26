
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Helper to format date objects to readable strings
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Process data based on type to ensure proper display in exports
const processDataForExport = (data, type) => {
  return data.map(item => {
    const processedItem = { ...item };
    
    // Format date fields
    if (processedItem.created_at) {
      processedItem.created_at = formatDate(processedItem.created_at);
    }
    if (processedItem.updated_at) {
      processedItem.updated_at = formatDate(processedItem.updated_at);
    }
    if (processedItem.bill_date) {
      processedItem.bill_date = formatDate(processedItem.bill_date);
    }
    if (processedItem.due_date) {
      processedItem.due_date = formatDate(processedItem.due_date);
    }
    
    // Format array fields
    if (Array.isArray(processedItem.send_via)) {
      processedItem.send_via = processedItem.send_via.join(', ');
    }
    
    // Format boolean fields
    if (typeof processedItem.is_recurring === 'boolean') {
      processedItem.is_recurring = processedItem.is_recurring ? 'Yes' : 'No';
    }
    if (typeof processedItem.is_partner_transfer === 'boolean') {
      processedItem.is_partner_transfer = processedItem.is_partner_transfer ? 'Yes' : 'No';
    }
    
    return processedItem;
  });
};

// Get appropriate columns based on data type
const getColumnsForType = (type, data) => {
  if (!data || data.length === 0) return [];
  
  const firstItem = data[0];
  
  switch (type) {
    case 'reports':
      return ['Title', 'Report Type', 'Recipient', 'Date Created', 'Send Via', 'Location'];
    case 'associations':
      return ['Association Name', 'Registration Number', 'Type', 'Member Count', 'Farm Area', 'Coffee Types', 'Created Date'];
    case 'farms':
      return ['Farm Name', 'Manager', 'Supervisor', 'Location', 'Farm Size', 'Coffee Type', 'Created Date'];
    case 'requisitions':
      return ['Requester', 'Department', 'Type', 'Urgency', 'Status', 'Created Date', 'Details'];
    default:
      // Dynamically build columns from data
      return Object.keys(firstItem)
        .filter(key => key !== 'id' && key !== 'user_id') // Filter out unnecessary columns
        .map(key => {
          // Convert snake_case to Title Case
          return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        });
  }
};

// Get appropriate rows based on data type and columns
const getRowsForType = (type, data, columns) => {
  if (!data || data.length === 0) return [];
  
  switch (type) {
    case 'reports':
      return data.map(item => [
        item.title || '',
        item.report_type || '',
        item.recipient_name || '',
        formatDate(item.created_at),
        item.send_via ? (Array.isArray(item.send_via) ? item.send_via.join(', ') : item.send_via) : '',
        item.location || ''
      ]);
    case 'associations':
      return data.map(item => [
        item.association_name || '',
        item.registration_number || '',
        item.association_type || '',
        item.member_count || '0',
        item.total_farm_area ? `${item.total_farm_area} hectares` : 'N/A',
        item.coffee_types || '',
        formatDate(item.created_at)
      ]);
    case 'farms':
      return data.map(item => [
        item.farm_name || '',
        item.manager_name || '',
        item.supervisor_name || '',
        item.location || '',
        item.farm_size ? `${item.farm_size} hectares` : 'N/A',
        item.coffee_type || '',
        formatDate(item.created_at)
      ]);
    case 'requisitions':
      return data.map(item => [
        item.requester_name || '',
        item.department || '',
        item.requisition_type || '',
        item.urgency_level || '',
        item.status || '',
        formatDate(item.created_at),
        item.tools_machinery || item.repairs || item.justification || ''
      ]);
    default:
      // Generate rows based on columns dynamically
      return data.map(item => {
        const snakeCaseColumns = columns.map(col => 
          col.toLowerCase().replace(/ /g, '_')
        );
        
        return snakeCaseColumns.map(key => {
          let value = item[key];
          
          // Format dates
          if ((key.includes('date') || key.includes('time') || key === 'created_at' || key === 'updated_at') && value) {
            return formatDate(value);
          }
          
          // Format arrays
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          
          // Format booleans
          if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
          }
          
          return value || '';
        });
      });
  }
};

// Export data to CSV file
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const processedData = processDataForExport(data);
  
  // Convert data to CSV format
  const header = Object.keys(processedData[0]);
  const csvRows = [
    header.join(','), // Header row
    ...processedData.map(row => 
      header.map(fieldName => {
        let field = row[fieldName];
        
        // Handle arrays
        if (Array.isArray(field)) {
          field = field.join('; ');
        }
        
        // Escape commas and quotes
        if (typeof field === 'string') {
          field = field.replace(/"/g, '""');
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            field = `"${field}"`;
          }
        }
        
        return field || '';
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to Excel file
export const exportToExcel = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Process data for Excel formatting
  const processedData = processDataForExport(data);

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export data to PDF file
export const exportToPDF = (data, filename = 'export', type = '') => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Initialize PDF document
  const doc = new jsPDF();
  
  // Convert type to title case
  const title = type 
    ? type.charAt(0).toUpperCase() + type.slice(1) + ' Report'
    : 'Data Report';
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Get columns and rows based on data type
  const columns = getColumnsForType(type, data);
  const rows = getRowsForType(type, data, columns);
  
  // Create the table - fixed issue with autoTable
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 30,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { top: 30 },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'auto'
    },
    columnStyles: {
      text: { cellWidth: 'auto' }
    }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};
