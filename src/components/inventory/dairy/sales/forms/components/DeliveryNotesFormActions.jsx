
import React from 'react';
import { Button } from "@/components/ui/button";
import { QrCode, MapPin, Printer } from "lucide-react";

const DeliveryNotesFormActions = () => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Submit Delivery Note</Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Generating QR code...")}
      >
        <QrCode className="h-4 w-4" />
        Generate QR Code
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Adding geolocation...")}
      >
        <MapPin className="h-4 w-4" />
        Add Geolocation
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Printing delivery note...")}
      >
        <Printer className="h-4 w-4" />
        Print PDF
      </Button>
    </div>
  );
};

export default DeliveryNotesFormActions;
