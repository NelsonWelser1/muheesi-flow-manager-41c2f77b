
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrainingRecords } from '../hooks/useTrainingRecords';
import TrainingRecordsTable from './TrainingRecordsTable';
import RecordsToolbar from './RecordsToolbar';
import RecordsExportActions from './RecordsExportActions';

const TrainingRecordsDisplay = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  
  const { 
    records, 
    isLoading, 
    error, 
    refreshData 
  } = useTrainingRecords({ timeRange, searchTerm, status });

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
        <CardTitle>Training & Performance Records</CardTitle>
        <RecordsExportActions 
          records={records} 
          fileName="training_performance_records" 
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={handleStatusChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="low">Low Rating</TabsTrigger>
              <TabsTrigger value="high">High Rating</TabsTrigger>
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
            <TrainingRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <TrainingRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <TrainingRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="low" className="mt-0">
            <TrainingRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="high" className="mt-0">
            <TrainingRecordsTable records={records} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingRecordsDisplay;
