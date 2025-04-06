
import React from 'react';
import { Button } from "@/components/ui/button"; 
import { Printer, FileText, Send } from 'lucide-react';
import SaveContractButton from './SaveContractButton';

const ContractActions = ({ formData, onSuccess, onPrint, onExport, onSend }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end mt-6">
      <SaveContractButton formData={formData} onSuccess={onSuccess} />
      
      {onPrint && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Contract
        </Button>
      )}
      
      {onExport && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export to PDF
        </Button>
      )}
      
      {onSend && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSend}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send to Buyer
        </Button>
      )}
    </div>
  );
};

export default ContractActions;
