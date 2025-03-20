
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ExportActions = ({ data, title }) => {
  const { toast } = useToast();

  const handleExport = (format) => {
    if (!data?.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${title.toLowerCase()}-records-${timestamp}`;
      
      if (format === 'csv') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => 
          Object.values(row).map(val => 
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
          ).join(',')
        ).join('\n');
        const csv = `${headers}\n${rows}`;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Success",
          description: "CSV file exported successfully",
        });
      } else if (format === 'excel') {
        toast({
          title: "Excel Export",
          description: "Excel export functionality is in development",
        });
      } else if (format === 'pdf') {
        toast({
          title: "PDF Export",
          description: "PDF export functionality is in development",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export records",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
        <FileText className="h-4 w-4 mr-1" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
        <FileSpreadsheet className="h-4 w-4 mr-1" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
        <Download className="h-4 w-4 mr-1" />
        CSV
      </Button>
    </div>
  );
};

export default ExportActions;
