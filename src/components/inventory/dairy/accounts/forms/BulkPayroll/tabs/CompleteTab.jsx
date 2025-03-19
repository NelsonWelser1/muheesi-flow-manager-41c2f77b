
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useBulkPayroll } from '../BulkPayrollContext';

const CompleteTab = ({ onClose }) => {
  const { successCount, importedCount, resetState } = useBulkPayroll();

  return (
    <TabsContent value="complete" className="space-y-4">
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
        <h3 className="text-xl font-bold">Processing Complete!</h3>
        <p className="text-center my-2">
          Successfully processed {successCount} of {importedCount} payroll records.
        </p>
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            <XCircle className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button 
            className="bg-[#0000a0] hover:bg-[#00008b]"
            onClick={resetState}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Another Batch
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default CompleteTab;
