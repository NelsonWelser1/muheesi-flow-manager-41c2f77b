
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, FileText, Bug, Eye } from "lucide-react";

const DeliveryFormActions = ({ 
  onBack, 
  setShowNoteList,
  onDebug
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
        
        {onDebug && (
          <Button 
            variant="outline" 
            onClick={onDebug}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" /> Debug Form
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeliveryFormActions;
