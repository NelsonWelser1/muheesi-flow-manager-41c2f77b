
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV } from './utils/exportUtils';

const RecruitmentExportActions = ({ records, fileName = 'recruitment_records' }) => {
  if (!records || records.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToPDF(records, fileName)}>
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel(records, fileName)}>
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV(records, fileName)}>
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecruitmentExportActions;
