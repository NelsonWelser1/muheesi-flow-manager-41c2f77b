
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExportActions = ({ data, title }) => {
  const { toast } = useToast();

  // Export to CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get headers from first data object
      const headers = Object.keys(data[0]).filter(key => 
        typeof data[0][key] !== 'object' && 
        typeof data[0][key] !== 'function'
      );
      
      // Convert data to CSV rows
      const csvData = data.map(item => 
        headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (header === 'deliveryDate' && value) return new Date(value).toLocaleDateString();
          return value;
        })
      );
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      
      toast({
        title: "Export Successful",
        description: `Data exported to CSV successfully`,
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data to CSV",
        variant: "destructive"
      });
    }
  };

  // Export to Excel (simplified - in real scenarios use a proper Excel library)
  const exportToExcel = () => {
    exportToCSV(); // As a fallback, we'll use CSV
    
    toast({
      title: "Excel Export",
      description: "Excel export is provided as CSV format"
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 22);
      
      // Format data for the table
      const headers = Object.keys(data[0])
        .filter(key => 
          typeof data[0][key] !== 'object' && 
          typeof data[0][key] !== 'function' &&
          !Array.isArray(data[0][key])
        );
      
      const rows = data.map(item => 
        headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (header === 'deliveryDate' && value) return new Date(value).toLocaleDateString();
          return String(value);
        })
      );
      
      // Create the table
      doc.autoTable({
        head: [headers.map(h => h.charAt(0).toUpperCase() + h.slice(1))],
        body: rows,
        startY: 30,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 0, 160] },
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
      }
      
      // Save the PDF
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Successful",
        description: `Data exported to PDF successfully`,
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data to PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
