
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Mail, Download } from "lucide-react";

const PaymentsReceiptsFormActions = ({ paymentType }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">
        Record {paymentType === 'received' ? 'Receipt' : 'Payment'}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Generating receipt...")}
      >
        <CreditCard className="h-4 w-4" />
        Generate Receipt
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Emailing receipt...")}
      >
        <Mail className="h-4 w-4" />
        Email Receipt
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Downloading PDF...")}
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
};

export default PaymentsReceiptsFormActions;
