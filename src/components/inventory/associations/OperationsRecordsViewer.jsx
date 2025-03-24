
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, RefreshCw, Search, FileDown } from "lucide-react";
import { useOperationsForm } from '@/hooks/useOperationsForm';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { showInfoToast, showErrorToast } from "@/components/ui/notifications";

const OperationsRecordsViewer = ({ onBack, isKazo, associationId }) => {
  const { toast } = useToast();
  const {
    operations,
    timeRange,
    statusFilter,
    searchTerm,
    setTimeRange,
    setStatusFilter,
    setSearchTerm
  } = useOperationsForm(associationId);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh (no actual data fetching now)
    setTimeout(() => {
      setIsRefreshing(false);
      showInfoToast(toast, "Operation records have been refreshed");
    }, 500);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    if (operations.length === 0) {
      showErrorToast(toast, "There are no records to export");
      return;
    }

    try {
      // Prepare CSV header
      const headers = [
        'ID',
        'Association',
        'Next Meeting Date',
        'Training Schedule',
        'Collective Resources',
        'Shared Equipment',
        'Status',
        'Created',
        'Updated'
      ].join(',');

      // Prepare CSV rows
      const rows = operations.map(op => [
        op.id,
        associationId,
        op.next_meeting_date ? format(new Date(op.next_meeting_date), 'yyyy-MM-dd') : '',
        op.training_schedule ? format(new Date(op.training_schedule), 'yyyy-MM-dd') : '',
        `"${op.collective_resources || ''}"`,
        `"${op.shared_equipment || ''}"`,
        op.status,
        op.created_at ? format(new Date(op.created_at), 'yyyy-MM-dd HH:mm') : '',
        op.updated_at ? format(new Date(op.updated_at), 'yyyy-MM-dd HH:mm') : ''
      ].join(','));

      // Combine header and rows
      const csv = [headers, ...rows].join('\n');

      // Create a blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `operations_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showInfoToast(toast, "Operations data exported as CSV");
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      showErrorToast(toast, "Failed to export operations data");
    }
  };

  // Filter operations based on current filters
  const filteredOperations = operations.filter(operation => {
    // Apply status filter
    if (statusFilter !== 'all' && operation.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        (operation.collective_resources && operation.collective_resources.toLowerCase().includes(search)) ||
        (operation.shared_equipment && operation.shared_equipment.toLowerCase().includes(search)) ||
        (operation.status && operation.status.toLowerCase().includes(search))
      );
    }
    
    return true;
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h3 className="text-lg font-semibold">Operations Records</h3>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleExportCSV}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="postponed">Postponed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="day">Last Day</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredOperations.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No operations found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || statusFilter !== 'all' || timeRange !== 'all' 
                  ? "Try adjusting your filters" 
                  : "Create an operation to see it here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Meeting</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Schedule</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperations.map((operation) => (
                    <tr key={operation.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {operation.next_meeting_date 
                          ? format(new Date(operation.next_meeting_date), 'yyyy-MM-dd') 
                          : '-'}
                      </td>
                      <td className="px-4 py-2">
                        {operation.training_schedule 
                          ? format(new Date(operation.training_schedule), 'yyyy-MM-dd') 
                          : '-'}
                      </td>
                      <td className="px-4 py-2">{operation.collective_resources || '-'}</td>
                      <td className="px-4 py-2">{operation.shared_equipment || '-'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          operation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          operation.status === 'postponed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {operation.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {operation.created_at 
                          ? format(new Date(operation.created_at), 'yyyy-MM-dd HH:mm') 
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsRecordsViewer;
