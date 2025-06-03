
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';

const DossierExportActions = ({ dossiers, fileName = 'employee_dossiers' }) => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    if (!dossiers || dossiers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no dossiers to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      exportToPDF(dossiers, fileName);
      toast({
        title: "Export Successful",
        description: "PDF file has been generated and downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    if (!dossiers || dossiers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no dossiers to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      exportToExcel(dossiers, fileName);
      toast({
        title: "Export Successful",
        description: "Excel file has been generated and downloaded successfully.",
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export Excel. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    if (!dossiers || dossiers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no dossiers to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      exportToCSV(dossiers, fileName);
      toast({
        title: "Export Successful",
        description: "CSV file has been generated and downloaded successfully.",
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive"
      });
    }
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
