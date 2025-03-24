
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommunicationStatusTabs from './CommunicationStatusTabs';
import CommunicationSearchFilters from './CommunicationSearchFilters';
import CommunicationTable from './CommunicationTable';
import CommunicationExportActions from './CommunicationExportActions';
import CommunicationDetailsDialog from './CommunicationDetailsDialog';
import { useCommunicationMessages } from '@/hooks/useCommunicationMessages';

const CommunicationRecordsViewer = ({ onBack, associationId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'sentDate', direction: 'desc' });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const {
    messages,
    loading,
    error,
    fetchMessages,
    filterMessages
  } = useCommunicationMessages(associationId);
  
  const filteredMessages = filterMessages(searchTerm, status, timeRange);
  
  // Sort messages
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const { key, direction } = sortConfig;
    
    // Handle null or undefined values
    if (!a[key] && !b[key]) return 0;
    if (!a[key]) return direction === 'asc' ? -1 : 1;
    if (!b[key]) return direction === 'asc' ? 1 : -1;
    
    // Handle date comparison
    if (key === 'sentDate') {
      if (!a.sentDate) return direction === 'asc' ? -1 : 1;
      if (!b.sentDate) return direction === 'asc' ? 1 : -1;
      return direction === 'asc' 
        ? new Date(a.sentDate) - new Date(b.sentDate)
        : new Date(b.sentDate) - new Date(a.sentDate);
    }
    
    // Handle string comparison
    return direction === 'asc'
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });
  
  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setIsDetailsDialogOpen(true);
  };
  
  const handleRefresh = () => {
    fetchMessages();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Communication Records</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <CommunicationExportActions messages={sortedMessages} selectedMessage={selectedMessage} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CommunicationStatusTabs status={status} setStatus={setStatus} />
        
        <CommunicationSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
        
        <CommunicationTable
          messages={sortedMessages}
          loading={loading}
          onViewDetails={handleViewDetails}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
        
        <CommunicationDetailsDialog
          message={selectedMessage}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
      </CardContent>
    </Card>
  );
};

export default CommunicationRecordsViewer;
