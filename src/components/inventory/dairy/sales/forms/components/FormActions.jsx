
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save, Truck } from "lucide-react";

const FormActions = ({ 
  isSaving, 
  onDebug, 
  showDeliveryButton 
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        type="submit" 
        className="bg-[#0000a0] hover:bg-[#00008b]"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : "Submit Order"}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onDebug}
      >
        <Save className="h-4 w-4" />
        Debug Form
      </Button>
      
      {showDeliveryButton && (
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => console.log("Creating delivery note...")}
        >
          <Truck className="h-4 w-4" />
          Create Delivery Note
        </Button>
      )}
    </div>
  );
};

export default FormActions;
