
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';

const DossierExportActions = ({ dossiers, fileName = 'employee_dossiers' }) => {
  const handleExportPDF = () => {
    if (!dossiers || dossiers.length === 0) {
      console.warn('No dossiers to export');
      return;
    }
    exportToPDF(dossiers, fileName);
  };

  const handleExportExcel = () => {
    if (!dossiers || dossiers.length === 0) {
      console.warn('No dossiers to export');
      return;
    }
    exportToExcel(dossiers, fileName);
  };

  const handleExportCSV = () => {
    if (!dossiers || dossiers.length === 0) {
      console.warn('No dossiers to export');
      return;
    }
    exportToCSV(dossiers, fileName);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} className="flex items-center gap-2">
          <File className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DossierExportActions;
