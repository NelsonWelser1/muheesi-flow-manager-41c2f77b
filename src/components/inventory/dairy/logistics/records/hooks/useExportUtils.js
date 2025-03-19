
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { useLogisticsRecords } from './useLogisticsRecords';

export const useExportUtils = (activeTab) => {
  const { toast } = useToast();
  const { deliveries, orders, performance } = useLogisticsRecords('', 'all', 'all', { key: 'created_at', direction: 'desc' });

  // Get active data based on current tab
  const getActiveData = () => {
    switch (activeTab) {
      case 'deliveries':
        return deliveries;
      case 'orders':
        return orders;
      case 'performance':
        return performance;
      default:
        return [];
    }
  };

  // Get title based on current tab
  const getTitle = () => {
    switch (activeTab) {
      case 'deliveries':
        return 'Logistics Deliveries';
      case 'orders':
        return 'Logistics Orders';
      case 'performance':
        return 'Delivery Performance';
      default:
        return 'Logistics Records';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const data = getActiveData();
      if (!data || data.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records to export",
          variant: "destructive"
        });
        return;
      }

      // Get all keys from the first object
      const keys = Object.keys(data[0]);
      
      // Convert snake_case to Title Case for headers
      const headers = keys.map(key => 
        key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
      
      // Convert data to rows
      const rows = data.map(item => 
        keys.map(key => {
          // Format dates
          if (key.includes('date') || key.includes('time') || key === 'created_at' || key === 'updated_at') {
            return formatDate(item[key]);
          }
          return item[key];
        })
      );
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'object' ? JSON.stringify(cell) : String(cell).replace(/,/g, ';')
        ).join(','))
      ].join('\n');
      
      // Create and download blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${getTitle().toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Data exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to CSV",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const data = getActiveData();
      if (!data || data.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records to export",
          variant: "destructive"
        });
        return;
      }

      // Process data to handle dates
      const processedData = data.map(item => {
        const processed = {};
        Object.keys(item).forEach(key => {
          if (key.includes('date') || key.includes('time') || key === 'created_at' || key === 'updated_at') {
            processed[key] = formatDate(item[key]);
          } else if (typeof item[key] === 'object' && item[key] !== null) {
            processed[key] = JSON.stringify(item[key]);
          } else {
            processed[key] = item[key];
          }
        });
        return processed;
      });
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, getTitle());
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${getTitle().toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Data exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to Excel",
        variant: "destructive"
      });
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const data = getActiveData();
      if (!data || data.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records to export",
          variant: "destructive"
        });
        return;
      }

      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(18);
      doc.text(getTitle(), 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 30);
      
      // Get relevant keys from data (exclude some system fields)
      const excludedKeys = ['created_at', 'updated_at', 'operator_id', 'id'];
      const firstItem = data[0];
      
      // Limit columns for better readability (first 10 fields except the excluded)
      const keys = Object.keys(firstItem)
        .filter(key => !excludedKeys.includes(key))
        .slice(0, 10);
      
      // Convert data for table
      const tableData = data.map(item => {
        const rowData = [];
        
        keys.forEach(key => {
          if (key.includes('date') || key.includes('time')) {
            rowData.push(formatDate(item[key]));
          } else if (typeof item[key] === 'object' && item[key] !== null) {
            rowData.push(JSON.stringify(item[key]).substring(0, 30) + (JSON.stringify(item[key]).length > 30 ? '...' : ''));
          } else {
            rowData.push(item[key]);
          }
        });
        
        return rowData;
      });
      
      // Generate readable headers from keys (convert snake_case to Title Case)
      const headers = keys.map(key => 
        key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
      
      // Add table
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 40,
        margin: { top: 15 },
        styles: { overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 25 } },
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Save PDF
      doc.save(`${getTitle().toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Data exported to PDF successfully"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to PDF",
        variant: "destructive"
      });
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
};

export default useExportUtils;
