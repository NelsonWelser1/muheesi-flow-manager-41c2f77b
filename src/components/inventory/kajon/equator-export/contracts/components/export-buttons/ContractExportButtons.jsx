
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  FileText, 
  FileImage, 
  FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  exportContractToPDF, 
  exportContractToJPG, 
  exportContractToExcel 
} from '../../utils/contractExportUtils';

const ContractExportButtons = ({ 
  templateRef, 
  contractData,
  filename = 'contract',
  showDropdown = true,
  disabled = false
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format) => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      let success = false;
      
      switch (format) {
        case 'pdf':
          success = await exportContractToPDF(templateRef.current, filename, toast);
          break;
        case 'jpg':
          success = await exportContractToJPG(templateRef.current, filename, toast);
          break;
        case 'excel':
          success = await exportContractToExcel(templateRef.current, contractData, filename, toast);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      if (!success) {
        throw new Error(`Failed to export ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Export error:`, error);
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            disabled={disabled || isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Contract"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Save as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Save as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('jpg')}>
            <FileImage className="h-4 w-4 mr-2" />
            Save as Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={disabled || isExporting}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={disabled || isExporting}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('jpg')}
        disabled={disabled || isExporting}
        className="flex items-center gap-1"
      >
        <FileImage className="h-4 w-4" />
        JPG
      </Button>
    </div>
  );
};

export default ContractExportButtons;
