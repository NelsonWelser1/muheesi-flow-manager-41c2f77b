
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecruitmentRecords } from '../hooks/useRecruitmentRecords';
import RecruitmentRecordsTable from './RecruitmentRecordsTable';
import RecordsToolbar from './RecordsToolbar';
import RecruitmentExportActions from './RecruitmentExportActions';

const RecruitmentRecordsDisplay = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  
  const { 
    records, 
    isLoading, 
    error, 
    refreshData 
  } = useRecruitmentRecords({ timeRange, searchTerm, status });

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recruitment Records</CardTitle>
        <RecruitmentExportActions 
          records={records} 
          fileName="recruitment_records" 
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={handleStatusChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="In Progress">In Progress</TabsTrigger>
              <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
            <RecordsToolbar 
              onTimeRangeChange={handleTimeRangeChange} 
              onSearch={handleSearch}
              onRefresh={refreshData}
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          </div>

          <TabsContent value="all" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Pending" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="In Progress" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Scheduled" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Completed" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="Rejected" className="mt-0">
            <RecruitmentRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecruitmentRecordsDisplay;
