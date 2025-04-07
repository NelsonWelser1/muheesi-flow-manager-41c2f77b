
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportContractToPDF, exportContractToJPG, exportContractToExcel } from '../../utils/contractExportUtils';
import { useToast } from '@/components/ui/use-toast';

const ContractExportButtons = ({ 
  templateRef, 
  contractData, 
  filename, 
  showDropdown = true,
  disabled = false
}) => {
  const { toast } = useToast();
  
  const handleExportPDF = async () => {
    await exportContractToPDF(templateRef.current, filename, toast);
  };
  
  const handleExportJPG = async () => {
    await exportContractToJPG(templateRef.current, filename, toast);
  };
  
  const handleExportExcel = async () => {
    await exportContractToExcel(templateRef.current, contractData, filename, toast);
  };
  
  if (!showDropdown) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleExportPDF}
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportJPG}
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          JPG
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportExcel}
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Excel
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative group">
      <Button 
        variant="outline" 
        className="flex items-center gap-1"
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 hidden group-hover:block">
        <div className="py-1">
          <button
            onClick={handleExportPDF}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={disabled}
          >
            Export as PDF
          </button>
          <button
            onClick={handleExportJPG}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={disabled}
          >
            Export as JPG
          </button>
          <button
            onClick={handleExportExcel}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={disabled}
          >
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractExportButtons;
