
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

const BillsExpensesFormActions = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Record Expense</Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Uploading attachment...")}
      >
        <Upload className="h-4 w-4" />
        Attach Invoice/Receipt
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Setting as recurring...")}
      >
        <FileText className="h-4 w-4" />
        Set as Recurring
      </Button>
    </div>
  );
};

export default BillsExpensesFormActions;
