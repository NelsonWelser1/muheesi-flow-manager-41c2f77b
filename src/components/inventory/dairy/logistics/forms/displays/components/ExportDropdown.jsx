
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Share2
} from "lucide-react";

const ExportDropdown = ({ 
  exportToPDF, 
  exportToExcel, 
  exportToCSV, 
  shareViaEmail, 
  shareViaWhatsApp 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
          <span className="sr-only">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaWhatsApp}>
          <Share2 className="mr-2 h-4 w-4" />
          Share via WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
