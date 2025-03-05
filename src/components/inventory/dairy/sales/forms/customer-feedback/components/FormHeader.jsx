
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Bug } from "lucide-react";

const FormHeader = ({ onViewReports, onDebug }) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        onClick={onDebug}
        className="flex items-center gap-2"
        type="button"
      >
        <Bug className="h-4 w-4" /> Debug
      </Button>
      <Button 
        variant="outline" 
        onClick={onViewReports}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" /> View Reports
      </Button>
    </div>
  );
};

export default FormHeader;
