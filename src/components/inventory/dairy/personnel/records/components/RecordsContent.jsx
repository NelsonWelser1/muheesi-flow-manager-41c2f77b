
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RecruitmentRecordsTable from '../RecruitmentRecordsTable';

const RecordsContent = ({ records, isLoading, error }) => {
  const statuses = ['all', 'Pending', 'In Progress', 'Scheduled', 'Completed', 'Rejected'];
  
  return (
    <>
      {statuses.map(status => (
        <TabsContent key={status} value={status} className="mt-0">
          <RecruitmentRecordsTable 
            records={records} 
            isLoading={isLoading} 
            error={error} 
          />
        </TabsContent>
      ))}
    </>
  );
};

export default RecordsContent;
