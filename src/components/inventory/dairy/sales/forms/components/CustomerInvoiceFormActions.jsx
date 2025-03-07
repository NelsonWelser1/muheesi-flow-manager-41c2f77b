
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Mail, Phone, Printer, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CustomerInvoiceFormActions = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <div className="flex items-center w-full justify-between mb-2">
        <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Create Invoice</Button>
        <Badge variant="outline" className="flex items-center gap-1 py-1">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span>Status: Pending</span>
        </Badge>
      </div>
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
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Printing invoice...")}
      >
        <Printer className="h-4 w-4" />
        Print Invoice
      </Button>
    </div>
  );
};

export default CustomerInvoiceFormActions;
