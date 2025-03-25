
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from 'lucide-react';
import StatusTabs from './components/StatusTabs';
import RecordsToolbar from './components/RecordsToolbar';
import RequisitionRecordsTable from './components/RequisitionRecordsTable';
import RequisitionExportActions from './components/RequisitionExportActions';
import { useRequisitionRecords } from './hooks/useRequisitionRecords';

const RequisitionRecordsView = ({ onBack }) => {
  const [status, setStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const { records, isLoading, error, refreshRecords } = useRequisitionRecords({
    status,
    timeRange,
    searchTerm,
    sortConfig
  });

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    refreshRecords();
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">Requisition Records</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <RequisitionExportActions records={records} fileName="requisition_records" />
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <StatusTabs status={status} onStatusChange={handleStatusChange} />
          
          <RecordsToolbar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
          
          <RequisitionRecordsTable
            records={records}
            sortConfig={sortConfig}
            onSort={handleSort}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </Card>
    </div>
  );
};

export default RequisitionRecordsView;
