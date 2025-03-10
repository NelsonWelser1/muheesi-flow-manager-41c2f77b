
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";

const DeliveryFormActions = ({ onBack, setShowNoteList }) => {
  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setShowNoteList(true)}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" /> View Delivery Notes
      </Button>
    </div>
  );
};

export default DeliveryFormActions;
