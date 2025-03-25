
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportActions = ({ 
  data, 
  title, 
  isSingleEntry = false, 
  onRefresh,
  isLoading 
}) => {
  const { toast } = useToast();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const exportToCSV = () => {
    if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data)) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const exportData = isSingleEntry && !Array.isArray(data) ? [data] : data;
      
      // Get all keys from the first object
      const keys = Object.keys(exportData[0]);
      
      // Convert snake_case to Title Case for headers
      const headers = keys.map(key => 
        key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
      
      // Convert data to rows
      const rows = exportData.map(item => 
        keys.map(key => {
          // Format dates
          if (key.includes('date') || key === 'created_at' || key === 'updated_at') {
            return formatDate(item[key]);
          }
          return item[key];
        })
      );
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          typeof cell === 'object' ? JSON.stringify(cell) : String(cell || '').replace(/,/g, ';')
        ).join(','))
      ].join('\n');
      
      // Create and download blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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

  const exportToExcel = () => {
    if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data)) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const exportData = isSingleEntry && !Array.isArray(data) ? [data] : data;
      
      // Process data to handle dates
      const processedData = exportData.map(item => {
        const processed = {};
        Object.keys(item).forEach(key => {
          if (key.includes('date') || key === 'created_at' || key === 'updated_at') {
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
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
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

  const exportToPDF = () => {
    if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data)) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const exportData = isSingleEntry && !Array.isArray(data) ? [data] : data;
      
      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);
      
      // Get relevant keys from data (exclude some system fields)
      const excludedKeys = ['id', 'updated_at'];
      const firstItem = exportData[0];
      
      // Limit columns for better readability (first 8 fields except the excluded)
      const keys = Object.keys(firstItem)
        .filter(key => !excludedKeys.includes(key))
        .slice(0, 8);
      
      // Convert data for table
      const tableData = exportData.map(item => {
        const rowData = [];
        
        keys.forEach(key => {
          if (key.includes('date') || key === 'created_at') {
            rowData.push(formatDate(item[key]));
          } else if (typeof item[key] === 'object' && item[key] !== null) {
            rowData.push(JSON.stringify(item[key]).substring(0, 30) + '...');
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
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Save PDF
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
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

  return (
    <div className="flex space-x-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden md:inline">CSV</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden md:inline">Excel</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">PDF</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="hidden md:inline">Refresh</span>
      </Button>
    </div>
  );
};

export default ExportActions;
