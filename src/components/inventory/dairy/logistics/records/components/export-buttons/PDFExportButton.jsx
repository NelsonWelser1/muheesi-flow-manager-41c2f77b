
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const PDFExportButton = ({ onClick, disabled = false }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onClick();
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-1"
      title="Export to PDF"
    >
      <FileText className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
      PDF
    </Button>
  );
};

export default PDFExportButton;
