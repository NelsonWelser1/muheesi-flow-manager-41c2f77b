
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Process data for export based on analytics tab
export const processAnalyticsData = (data, tabType) => {
  switch (tabType) {
    case 'production':
      return data.map(item => ({
        'Month': item.month,
        'Arabica (kg)': item.arabica,
        'Robusta (kg)': item.robusta,
        'Total (kg)': (item.arabica || 0) + (item.robusta || 0)
      }));
      
    case 'members':
      return data.map(item => ({
        'Month': item.month,
        'Number of Members': item.members
      }));
      
    case 'quality':
      return data.map(item => ({
        'Quality Grade': item.name,
        'Percentage': `${item.value}%`
      }));
      
    case 'financial':
      return data.map(item => ({
        'Month': item.month,
        'Revenue (UGX)': item.revenue,
        'Revenue (USD)': Math.round((item.revenue || 0) / 3700)
      }));
      
    case 'impact':
      return data.map(item => ({
        'Metric': item.metric,
        'Value': item.value
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
          
          processedItem[header] = item[key];
        });
        return processedItem;
      });
  }
};

// Export to PDF
export const exportToPDF = (data, filename, title) => {
  if (!data || data.length === 0) return;
  
  // Process data appropriately
  const processedData = Array.isArray(data) ? processAnalyticsData(data) : [data];
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title || 'Association Analytics Report', 14, 15);
  
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
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) return;
  
  // Process data appropriately
  const processedData = Array.isArray(data) ? processAnalyticsData(data) : [data];
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics');
  
  // Generate and download Excel file
  XLSX.writeFile(workbook, `${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Export to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  // Process data appropriately
  const processedData = Array.isArray(data) ? processAnalyticsData(data) : [data];
  
  // Create headers and rows
  const headers = Object.keys(processedData[0]);
  const rows = processedData.map(item => headers.map(header => item[header]));
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => 
      cell !== undefined && cell !== null ? `"${String(cell).replace(/"/g, '""')}"` : ''
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

// Take screenshot of a specific element and download
export const captureScreenshot = async (elementId, filename, format = 'jpg') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Use html2canvas to capture the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    if (format === 'jpg') {
      // Convert to JPG and download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // Create PDF with the screenshot
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm'
      });
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    }
    
    return true;
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw error;
  }
};

