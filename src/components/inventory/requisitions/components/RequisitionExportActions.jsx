
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { exportToPDF, exportToExcel, exportToCSV } from './utils/exportUtils';
import { useToast } from "@/components/ui/use-toast";

const RequisitionExportActions = ({ records, fileName = 'requisition_records' }) => {
  const { toast } = useToast();

  const handleExport = (format) => {
    if (!records || records.length === 0) {
      toast({
        title: "No records to export",
        description: "There are no requisition records available to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      switch(format) {
        case 'pdf':
          exportToPDF(records, fileName);
          break;
        case 'excel':
          exportToExcel(records, fileName);
          break;
        case 'csv':
          exportToCSV(records, fileName);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequisitionExportActions;
