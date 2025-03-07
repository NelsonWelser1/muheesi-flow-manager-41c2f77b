
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const FormHeader = ({ onShowRecords }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Manage Deliveries</h2>
      <Button 
        variant="outline" 
        onClick={onShowRecords}
        className="flex items-center gap-1"
      >
        <Eye className="h-4 w-4" /> View Records
      </Button>
    </div>
  );
};

export default FormHeader;
