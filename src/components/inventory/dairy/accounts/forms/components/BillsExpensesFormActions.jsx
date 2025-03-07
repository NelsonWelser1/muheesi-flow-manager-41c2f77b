
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, Save } from "lucide-react";
import { useBillsExpensesForm } from '../hooks/useBillsExpensesForm';

const BillsExpensesFormActions = ({ onSubmit }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button 
        type="submit" 
        className="bg-[#0000a0] hover:bg-[#00008b] flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Record Expense
      </Button>
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
