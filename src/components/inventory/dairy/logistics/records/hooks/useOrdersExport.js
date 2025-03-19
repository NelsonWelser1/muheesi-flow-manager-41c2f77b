
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const useOrdersExport = (orders) => {
  const { toast } = useToast();

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
      if (!orders || orders.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no order records to export",
          variant: "destructive"
        });
        return;
      }

      // Get all keys from the first object
      const keys = Object.keys(orders[0]);
      
      // Convert snake_case to Title Case for headers
      const headers = keys.map(key => 
        key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
      
      // Convert data to rows
      const rows = orders.map(item => 
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
      link.download = `logistics-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Order data exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export order data to CSV",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      if (!orders || orders.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no order records to export",
          variant: "destructive"
        });
        return;
      }

      // Process data to handle dates
      const processedData = orders.map(item => {
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `logistics-orders-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Order data exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export order data to Excel",
        variant: "destructive"
      });
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      if (!orders || orders.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no order records to export",
          variant: "destructive"
        });
        return;
      }

      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(18);
      doc.text("Logistics Orders", 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 30);
      
      // Get relevant keys from data (exclude some system fields)
      const excludedKeys = ['created_at', 'updated_at', 'id'];
      const firstItem = orders[0];
      
      // Limit columns for better readability (first 8 fields except the excluded)
      const keys = Object.keys(firstItem)
        .filter(key => !excludedKeys.includes(key))
        .slice(0, 8);
      
      // Convert data for table
      const tableData = orders.map(item => {
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
      doc.save(`logistics-orders-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Order data exported to PDF successfully"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export order data to PDF",
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

export default useOrdersExport;
