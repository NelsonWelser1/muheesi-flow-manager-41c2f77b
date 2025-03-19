
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

const ExcelExportButton = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
      title="Export to Excel"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Excel
    </Button>
  );
};

export default ExcelExportButton;
