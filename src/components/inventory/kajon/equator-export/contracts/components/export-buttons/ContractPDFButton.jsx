
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const ContractPDFButton = ({ 
  onClick, 
  disabled = false, 
  className = "",
  size = "sm",
  variant = "outline",
  label = "PDF",
  title = "Export to PDF"
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onClick();
      showSuccessToast(toast, "PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      showErrorToast(toast, `Failed to export PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`flex items-center gap-1 ${className} ${isExporting ? 'opacity-80' : ''}`}
      title={title}
    >
      <Download className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
      {label}
    </Button>
  );
};

export default ContractPDFButton;
