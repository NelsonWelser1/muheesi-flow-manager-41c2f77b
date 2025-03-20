
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LogisticsHeader = ({ activeComponent, onBack, onViewRecords }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/manage-inventory')}
      >
        ← Back to Inventory
      </Button>
      
      {!activeComponent && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewRecords}
          className="flex items-center gap-2"
        >
          View All Records
        </Button>
      )}
    </div>
  );
};

export default LogisticsHeader;
