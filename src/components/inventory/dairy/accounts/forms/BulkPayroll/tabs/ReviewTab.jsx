
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import BulkPayrollTable from "../../components/BulkPayrollTable";
import { useBulkPayroll } from '../BulkPayrollContext';

const ReviewTab = () => {
  const { 
    employeeRecords, 
    processing, 
    handleUpdateEmployeeData, 
    handleProcessPayroll 
  } = useBulkPayroll();

  return (
    <TabsContent value="review" className="space-y-4">
      <BulkPayrollTable 
        records={employeeRecords} 
        onUpdateRecords={handleUpdateEmployeeData} 
      />
      
      <div className="mt-4 flex justify-end">
        <Button
          className="bg-[#0000a0] hover:bg-[#00008b]"
          onClick={handleProcessPayroll}
          disabled={processing}
        >
          {processing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Process Payroll ({employeeRecords.length} employees)
            </>
          )}
        </Button>
      </div>
    </TabsContent>
  );
};

export default ReviewTab;
