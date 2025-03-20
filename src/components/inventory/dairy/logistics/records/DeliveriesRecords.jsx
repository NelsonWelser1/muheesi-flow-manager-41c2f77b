
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import DeliveriesRecordsTable from './components/DeliveriesRecordsTable';
import DeliveriesToolbar from './components/DeliveriesToolbar';
import { useDeliveryRecords } from './hooks/useDeliveryRecords';
import useDeliveryExports from './hooks/useDeliveryExports';

const DeliveriesRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { toast } = useToast();
  
  // Fetch and filter delivery records
  const {
    deliveries,
    isLoading,
    error,
    refetchRecords
  } = useDeliveryRecords(searchTerm, timeRange, statusFilter, sortConfig);

  // Export functionality
  const { exportToCSV, exportToExcel, exportToPDF } = useDeliveryExports(deliveries);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await refetchRecords();
      toast({
        title: "Records refreshed",
        description: "The latest delivery records have been loaded.",
      });
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: err.message || "Failed to refresh records",
        variant: "destructive",
      });
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load delivery records: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Delivery Records</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <DeliveriesToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          deliveriesCount={deliveries.length}
          onExportCSV={exportToCSV}
          onExportExcel={exportToExcel}
          onExportPDF={exportToPDF}
          isLoading={isLoading}
        />

        {isLoading ? (
          <Skeleton className="w-full h-96" />
        ) : deliveries.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Deliveries</AlertTitle>
            <AlertDescription>
              No delivery records found. Try adjusting your filters or add new deliveries.
            </AlertDescription>
          </Alert>
        ) : (
          <DeliveriesRecordsTable 
            deliveries={deliveries} 
            handleSort={handleSort} 
            sortConfig={sortConfig}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveriesRecords;
