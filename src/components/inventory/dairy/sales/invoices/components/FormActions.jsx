
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const FormActions = ({ isUploading, onAttachFile }) => {
  return (
    <div className="flex gap-4">
      <Button 
        type="submit" 
        className="bg-[#0000a0] hover:bg-[#00008b]"
        disabled={isUploading}
      >
        {isUploading ? "Creating Invoice..." : "Create Invoice"}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onAttachFile}
      >
        <Upload className="h-4 w-4" />
        Attach Payment Proof
      </Button>
    </div>
  );
};

export default FormActions;
