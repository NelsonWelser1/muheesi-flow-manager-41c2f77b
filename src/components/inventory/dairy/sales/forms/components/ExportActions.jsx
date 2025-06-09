
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CSVExportButton from './export/CSVExportButton';
import ExcelExportButton from './export/ExcelExportButton';
import PDFExportButton from './export/PDFExportButton';
import PrintOptions from './export/PrintOptions';

const ExportActions = ({ onExportCSV, onExportExcel, onExportPDF, isDisabled, data = [], filename = 'export' }) => {
  const { toast } = useToast();

  const handleSuccess = (message) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  };

  const handleError = (message) => {
    toast({
      title: "Export Failed",
      description: message,
      variant: "destructive",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isDisabled}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <CSVExportButton
          data={data}
          filename={filename}
          disabled={isDisabled}
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <ExcelExportButton
          data={data}
          filename={filename}
          disabled={isDisabled}
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <PDFExportButton
          data={data}
          filename={filename}
          disabled={isDisabled}
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <PrintOptions
          data={data}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
