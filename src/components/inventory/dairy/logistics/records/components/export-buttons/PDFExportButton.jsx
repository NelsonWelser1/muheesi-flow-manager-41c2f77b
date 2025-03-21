
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const PDFExportButton = ({ onClick, disabled = false }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1"
      title="Export to PDF"
    >
      <FileText className="h-4 w-4" />
      PDF
    </Button>
  );
};

export default PDFExportButton;
