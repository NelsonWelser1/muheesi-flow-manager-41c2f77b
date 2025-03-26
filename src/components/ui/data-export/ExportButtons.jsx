import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/coffee/coffeeExport";

const ExportButtons = ({ 
  data, 
  filename = 'export', 
  type = '',
  disabled = false,
  showDropdown = true
}) => {
  const { toast } = useToast();

  const handleExport = (format) => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records available to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      switch(format) {
        case 'pdf':
          exportToPDF(data, filename, type);
          break;
        case 'excel':
          exportToExcel(data, filename);
          break;
        case 'csv':
          exportToCSV(data, filename);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      toast({
        title: "Export successful",
        description: `Records exported to ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error(`Export error:`, error);
      toast({
        title: "Export failed",
        description: `Could not export data to ${format.toUpperCase()}: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // If using dropdown menu style
  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Otherwise, return individual buttons
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={disabled}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={disabled}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={disabled}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        CSV
      </Button>
    </div>
  );
};

export default ExportButtons;
