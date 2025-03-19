
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogisticsRecords } from './hooks/useLogisticsRecords';
import RecordsToolbar from './components/RecordsToolbar';
import DeliveriesTable from './components/DeliveriesTable';
import OrdersTable from './components/OrdersTable';
import PerformanceTable from './components/PerformanceTable';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const LogisticsRecordsView = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { toast } = useToast();
  
  const {
    deliveries,
    orders,
    performance,
    isLoading,
    error,
    refetchRecords
  } = useLogisticsRecords(searchTerm, timeRange, statusFilter, sortConfig);

  const handleRefresh = async () => {
    try {
      await refetchRecords();
      toast({
        title: "Records refreshed",
        description: "The latest logistics records have been loaded.",
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

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load logistics records: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Logistics Records</CardTitle>
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
        <Tabs defaultValue="deliveries" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <RecordsToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            activeTab={activeTab}
            recordsCount={
              activeTab === 'deliveries' ? deliveries.length :
              activeTab === 'orders' ? orders.length :
              performance.length
            }
          />

          <TabsContent value="deliveries">
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
              <DeliveriesTable 
                deliveries={deliveries} 
                handleSort={handleSort} 
                sortConfig={sortConfig}
              />
            )}
          </TabsContent>

          <TabsContent value="orders">
            {isLoading ? (
              <Skeleton className="w-full h-96" />
            ) : orders.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Orders</AlertTitle>
                <AlertDescription>
                  No order records found. Try adjusting your filters or add new orders.
                </AlertDescription>
              </Alert>
            ) : (
              <OrdersTable 
                orders={orders} 
                handleSort={handleSort} 
                sortConfig={sortConfig}
              />
            )}
          </TabsContent>

          <TabsContent value="performance">
            {isLoading ? (
              <Skeleton className="w-full h-96" />
            ) : performance.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Performance Data</AlertTitle>
                <AlertDescription>
                  No performance records found. Try adjusting your filters or add new performance metrics.
                </AlertDescription>
              </Alert>
            ) : (
              <PerformanceTable 
                performance={performance} 
                handleSort={handleSort} 
                sortConfig={sortConfig}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LogisticsRecordsView;
