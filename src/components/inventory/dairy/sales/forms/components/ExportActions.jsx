
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ExportActions = ({ data, title }) => {
  const { toast } = useToast();

  // Export to CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get all possible keys from all objects
      const allKeys = new Set();
      data.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      const headers = Array.from(allKeys);
      
      // Create CSV rows
      const csvData = data.map(item => 
        headers.map(header => {
          const value = item[header];
          // Handle different data types
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return value;
        })
      );
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      
      toast({
        title: "Export Successful",
        description: `${title} exported to CSV`
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
  };

  // Export to Excel (placeholder for now)
  const exportToExcel = () => {
    toast({
      title: "Excel Export",
      description: "Excel export functionality will be implemented soon"
    });
  };

  // Export to PDF (placeholder for now)
  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented soon"
    });
  };

  // Print data
  const printData = () => {
    toast({
      title: "Print",
      description: "Print functionality will be implemented soon"
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={printData}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
