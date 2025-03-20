
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const LogisticsHeader = ({
  activeComponent,
  onBack,
  onViewRecords
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      {activeComponent && activeComponent !== 'records' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack} 
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      )}
      
      {!activeComponent && onViewRecords && (
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewRecords}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Records
          </Button>
        </div>
      )}
    </div>
  );
};

export default LogisticsHeader;
