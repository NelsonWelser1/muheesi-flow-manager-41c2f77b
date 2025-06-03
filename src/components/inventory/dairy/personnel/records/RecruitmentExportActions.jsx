
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV } from './utils/exportUtils';

const RecruitmentExportActions = ({ records, fileName = 'recruitment_records' }) => {
  const handleExportPDF = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }
    exportToPDF(records, fileName);
  };

  const handleExportExcel = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }
    exportToExcel(records, fileName);
  };

  const handleExportCSV = () => {
    if (!records || records.length === 0) {
      console.warn('No records to export');
      return;
    }
    exportToCSV(records, fileName);
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

export default RecruitmentExportActions;
