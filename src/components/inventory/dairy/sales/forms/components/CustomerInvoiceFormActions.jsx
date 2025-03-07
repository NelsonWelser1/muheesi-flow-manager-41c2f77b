
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Mail, Phone } from "lucide-react";

const CustomerInvoiceFormActions = () => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Create Invoice</Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Uploading payment proof...")}
      >
        <Upload className="h-4 w-4" />
        Attach Payment Proof
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Sending email...")}
      >
        <Mail className="h-4 w-4" />
        Email Invoice
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Sending WhatsApp...")}
      >
        <Phone className="h-4 w-4" />
        WhatsApp Invoice
      </Button>
    </div>
  );
};

export default CustomerInvoiceFormActions;
