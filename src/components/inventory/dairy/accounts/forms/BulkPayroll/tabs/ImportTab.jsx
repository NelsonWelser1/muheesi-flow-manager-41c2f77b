
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ImportEmployeesForm from "../../components/ImportEmployeesForm";
import { useBulkPayroll } from '../BulkPayrollContext';

const ImportTab = () => {
  const { handleEmployeesImported } = useBulkPayroll();
  
  return (
    <TabsContent value="import" className="space-y-4">
      <ImportEmployeesForm onImport={handleEmployeesImported} />
    </TabsContent>
  );
};

export default ImportTab;
