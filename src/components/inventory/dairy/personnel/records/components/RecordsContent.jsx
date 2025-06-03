
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RecruitmentRecordsTable from '../RecruitmentRecordsTable';

const RecordsContent = ({ records, isLoading, error }) => {
  return (
    <>
      <TabsContent value="all" className="mt-0">
        <div id="recruitment-records-table">
          <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
        </div>
      </TabsContent>
      <TabsContent value="pending" className="mt-0">
        <div id="recruitment-records-table">
          <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
        </div>
      </TabsContent>
      <TabsContent value="interviewed" className="mt-0">
        <div id="recruitment-records-table">
          <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
        </div>
      </TabsContent>
      <TabsContent value="hired" className="mt-0">
        <div id="recruitment-records-table">
          <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
        </div>
      </TabsContent>
      <TabsContent value="rejected" className="mt-0">
        <div id="recruitment-records-table">
          <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
        </div>
      </TabsContent>
    </>
  );
};

export default RecordsContent;
