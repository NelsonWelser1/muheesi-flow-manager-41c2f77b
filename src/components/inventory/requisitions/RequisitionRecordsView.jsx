
import React, { useState } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRequisitions } from '@/hooks/useRequisitions';
import StatusTabs from './components/StatusTabs';
import RecordsToolbar from './components/RecordsToolbar';
import RequisitionExportActions from './components/RequisitionExportActions';
import RequisitionRecordsTable from './components/RequisitionRecordsTable';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "sonner";

const RequisitionRecordsView = ({ onBack }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  const { 
    requisitions, 
    loading, 
    error,
    fetchRequisitions,
    fetchRequisitionsByStatus,
    fetchRequisitionsByTimeRange,
    searchRequisitions
  } = useRequisitions();

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    fetchRequisitionsByStatus(newStatus);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    searchRequisitions(term);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    fetchRequisitionsByTimeRange(range);
  };

  const handleRefresh = () => {
    fetchRequisitions();
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Make Requisitions
          </Button>
          <h2 className="text-2xl font-bold">Requisition Records</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <RequisitionExportActions records={requisitions} fileName="requisition_records" />
        </div>
      </div>

      <StatusTabs status={status} onStatusChange={handleStatusChange} />
      
      <RecordsToolbar 
        searchTerm={searchTerm} 
        onSearch={handleSearch} 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange} 
      />
      
      <RequisitionRecordsTable 
        records={requisitions} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default RequisitionRecordsView;
