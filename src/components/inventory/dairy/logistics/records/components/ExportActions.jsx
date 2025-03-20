
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";

const ExportActions = ({ onExportCSV, onExportExcel, onExportPDF, isDisabled }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportCSV}
        disabled={isDisabled}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">CSV</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportExcel}
        disabled={isDisabled}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Excel</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportPDF}
        disabled={isDisabled}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
    </div>
  );
};

export default ExportActions;
