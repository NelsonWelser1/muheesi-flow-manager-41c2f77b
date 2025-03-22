
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

// Process data for export based on report type
const processReportData = (data, reportType) => {
  switch (reportType) {
    case 'production':
      return data.map(item => ({
        'Date': formatDate(item.created_at || item.production_date),
        'Product': item.product_type || item.cheese_type || 'Unknown',
        'Quantity': item.finished_product_amount || item.expected_yield || 0,
        'Raw Material': item.raw_material_used || item.milk_volume || 0,
        'Efficiency': `${item.efficiency_percentage || 0}%`,
        'Batch ID': item.batch_id || 'N/A',
        'Operator': item.operator_name || 'N/A',
        'Status': item.status || 'Completed'
      }));
      
    case 'sales':
      return data.map(item => ({
        'Date': formatDate(item.created_at || item.date_time),
        'Customer': item.customer_name || 'N/A',
        'Product': item.product_name || 'N/A',
        'Quantity': item.quantity || 0,
        'Unit Price': item.price_per_unit || 0,
        'Total': item.total_amount || (item.quantity * item.price_per_unit) || 0,
        'Payment Method': item.payment_method || 'N/A',
        'Status': item.order_status || 'Completed'
      }));
      
    case 'quality':
      return data.map(item => ({
        'Date': formatDate(item.created_at || item.check_date),
        'Product': item.product_name || 'Milk',
        'Quality Score': item.quality_score || calculateQualityScore(item),
        'Temperature': item.temperature || 'N/A',
        'pH Level': item.ph_level || 'N/A',
        'Fat %': item.fat_percentage || 'N/A',
        'Protein %': item.protein_percentage || 'N/A',
        'Inspector': item.inspector_name || 'N/A'
      }));
      
    case 'inventory':
      return data.map(item => ({
        'Date': formatDate(item.created_at || item.updated_at),
        'Product': item.product_name || 'N/A',
        'Quantity': item.quantity || 0,
        'Unit': item.unit || 'kg',
        'Location': item.storage_location || 'N/A',
        'Expiry Date': formatDate(item.expiry_date) || 'N/A',
        'Status': item.status || 'In Stock',
        'Value': item.value || 0
      }));
      
    default:
      return data.map(item => {
        const processedItem = {};
        Object.keys(item).forEach(key => {
          // Convert snake_case to Title Case
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
  }
};

// Helper function to calculate quality score
const calculateQualityScore = (item) => {
  if (item.quality_score) return item.quality_score;
  
  // Calculate score based on various parameters if available
  const checkFields = [
    item.temperature_status === 'pass',
    item.ph_status === 'pass',
    item.moisture_status === 'pass',
    item.fat_status === 'pass',
    item.protein_status === 'pass',
    item.salt_status === 'pass'
  ];
  
  const validChecks = checkFields.filter(check => check !== undefined);
  if (validChecks.length === 0) return 'N/A';
  
  const passedChecks = checkFields.filter(check => check === true);
  return `${Math.round((passedChecks.length / validChecks.length) * 100)}%`;
};

// Export to PDF
export const exportToPDF = (data, filename, reportType) => {
  if (!data || data.length === 0) return;
  
  const processedData = processReportData(data, reportType);
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  const title = filename.replace(/_/g, ' ');
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 22);
  
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
  doc.save(`${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, filename, reportType) => {
  if (!data || data.length === 0) return;
  
  const processedData = processReportData(data, reportType);
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
  // Generate and download Excel file
  XLSX.writeFile(workbook, `${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Export to CSV
export const exportToCSV = (data, filename, reportType) => {
  if (!data || data.length === 0) return;
  
  const processedData = processReportData(data, reportType);
  
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
  link.setAttribute('download', `${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
