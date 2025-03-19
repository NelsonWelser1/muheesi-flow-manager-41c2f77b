
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const CSVExportButton = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
      title="Export to CSV"
    >
      <Download className="h-4 w-4" />
      CSV
    </Button>
  );
};

export default CSVExportButton;
