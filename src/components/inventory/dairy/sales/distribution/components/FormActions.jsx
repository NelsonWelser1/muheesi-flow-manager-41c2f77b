
import React from 'react';
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const FormActions = ({ setShowQR }) => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="flex-1">Submit Sales Record</Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setShowQR(true)}
        className="flex items-center gap-2"
      >
        <QrCode className="h-4 w-4" />
        Generate QR
      </Button>
    </div>
  );
};

export default FormActions;
