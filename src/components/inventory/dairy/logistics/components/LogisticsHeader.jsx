
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    </div>
  );
};

export default LogisticsHeader;
