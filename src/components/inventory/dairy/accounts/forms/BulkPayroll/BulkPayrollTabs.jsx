
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportTab from './tabs/ImportTab';
import ReviewTab from './tabs/ReviewTab';
import CompleteTab from './tabs/CompleteTab';
import { useBulkPayroll } from './BulkPayrollContext';

const BulkPayrollTabs = ({ onClose }) => {
  const { activeTab, setActiveTab, employeeRecords, successCount } = useBulkPayroll();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="import" disabled={activeTab === "complete"}>
          1. Import Employees
        </TabsTrigger>
        <TabsTrigger value="review" disabled={employeeRecords.length === 0 || activeTab === "complete"}>
          2. Review & Calculate
        </TabsTrigger>
        <TabsTrigger value="complete" disabled={successCount === 0}>
          3. Complete
        </TabsTrigger>
      </TabsList>
      
      <ImportTab />
      <ReviewTab />
      <CompleteTab onClose={onClose} />
    </Tabs>
  );
};

export default BulkPayrollTabs;
