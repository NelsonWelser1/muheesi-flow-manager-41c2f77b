
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, FileText, Eye } from "lucide-react";

const DeliveryFormActions = ({ 
  onBack, 
  setShowNoteList
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => setShowNoteList(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View Records
        </Button>
      </div>
    </div>
  );
};

export default DeliveryFormActions;
