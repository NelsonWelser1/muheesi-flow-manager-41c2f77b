
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import StatusTabs from './StatusTabs';
import RecordsToolbar from '../RecordsToolbar';
import RecordsContent from './RecordsContent';

const TabsContainer = ({ 
  onStatusChange, 
  onTimeRangeChange, 
  onSearch, 
  onRefresh, 
  timeRange, 
  searchTerm, 
  records, 
  isLoading, 
  error
}) => {
  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={onStatusChange}>
      <div className="flex justify-between items-center mb-4">
        <StatusTabs onStatusChange={onStatusChange} />
        <RecordsToolbar 
          onTimeRangeChange={onTimeRangeChange} 
          onSearch={onSearch}
          onRefresh={onRefresh}
          timeRange={timeRange}
          searchTerm={searchTerm}
        />
      </div>

      <RecordsContent 
        records={records} 
        isLoading={isLoading} 
        error={error} 
      />
    </Tabs>
  );
};

export default TabsContainer;
