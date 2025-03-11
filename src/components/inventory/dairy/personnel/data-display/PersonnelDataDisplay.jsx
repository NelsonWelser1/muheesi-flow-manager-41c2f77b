
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePersonnelData } from './hooks/usePersonnelData';
import SearchToolbar from './components/SearchToolbar';
import ExportActions from './components/ExportActions';
import DataTable from './components/DataTable';

const PersonnelDataDisplay = ({ tableName, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  const { data, isLoading } = usePersonnelData(tableName, searchTerm, timeRange);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title} Records</span>
        </CardTitle>
        <SearchToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <div className="flex justify-end mt-4">
          <ExportActions data={data} title={title} />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable data={data} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default PersonnelDataDisplay;
