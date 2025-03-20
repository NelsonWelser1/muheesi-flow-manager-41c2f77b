
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import DeliveriesTable from './components/DeliveriesTable';
import RecordsToolbar from './components/RecordsToolbar';
import { useLogisticsRecords } from './hooks/useLogisticsRecords';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDeliveriesExport from './hooks/useDeliveriesExport';

const DeliveriesRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { toast } = useToast();
  
  const {
    deliveries,
    isLoading,
    error,
    refetchRecords
  } = useLogisticsRecords(searchTerm, timeRange, statusFilter, sortConfig);

  const { exportToCSV, exportToExcel, exportToPDF } = useDeliveriesExport(deliveries);

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

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStatusChange = (status) => {
    setActiveStatusTab(status);
    setStatusFilter(status);
  };

  // Filter deliveries based on status tab
  const filteredDeliveries = activeStatusTab === 'all' 
    ? deliveries 
    : deliveries.filter(d => {
        const statusMap = {
          'pending': 'Pending',
          'in-transit': 'In Transit',
          'delivered': 'Delivered',
          'delayed': 'Delayed'
        };
        return d.status === statusMap[activeStatusTab];
      });

  const deliveryStatusCounts = {
    all: deliveries.length,
    pending: deliveries.filter(d => d.status === 'Pending').length,
    'in-transit': deliveries.filter(d => d.status === 'In Transit').length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
    delayed: deliveries.filter(d => d.status === 'Delayed').length
  };

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
        <RecordsToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          recordsCount={filteredDeliveries.length}
          recordType="deliveries"
          onExportCSV={exportToCSV}
          onExportExcel={exportToExcel}
          onExportPDF={exportToPDF}
        />

        <div className="mb-4">
          <Tabs value={activeStatusTab} onValueChange={handleStatusChange}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">
                All
                <span className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                  {deliveryStatusCounts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-2 bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs">
                  {deliveryStatusCounts.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-transit">
                In Transit
                <span className="ml-2 bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs">
                  {deliveryStatusCounts['in-transit']}
                </span>
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered
                <span className="ml-2 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                  {deliveryStatusCounts.delivered}
                </span>
              </TabsTrigger>
              <TabsTrigger value="delayed">
                Delayed
                <span className="ml-2 bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs">
                  {deliveryStatusCounts.delayed}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <Skeleton className="w-full h-96" />
        ) : filteredDeliveries.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Deliveries</AlertTitle>
            <AlertDescription>
              No delivery records found. Try adjusting your filters or add new deliveries.
            </AlertDescription>
          </Alert>
        ) : (
          <DeliveriesTable 
            deliveries={filteredDeliveries} 
            handleSort={handleSort} 
            sortConfig={sortConfig}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveriesRecords;
