
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const InvoiceHeader = ({ onBack, onViewInvoices }) => {
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
        onClick={onViewInvoices}
        className="flex items-center gap-2"
      >
        View Invoices
      </Button>
    </div>
  );
};

export default InvoiceHeader;
