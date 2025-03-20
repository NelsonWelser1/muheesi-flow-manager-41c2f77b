
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import OrdersTable from './components/OrdersTable';
import RecordsToolbar from './components/RecordsToolbar';
import { useOrdersRecords } from './hooks/useOrdersRecords';
import useOrdersExport from './hooks/useOrdersExport';

const OrdersRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { toast } = useToast();
  
  const {
    orders,
    isLoading,
    error,
    refetchRecords
  } = useOrdersRecords(searchTerm, timeRange, statusFilter, sortConfig);

  const { exportToCSV, exportToExcel, exportToPDF } = useOrdersExport(orders);

  const handleRefresh = async () => {
    try {
      await refetchRecords();
      toast({
        title: "Records refreshed",
        description: "The latest order records have been loaded.",
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
        <AlertDescription>Failed to load order records: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Order Records</CardTitle>
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
          recordsCount={orders.length}
          recordType="orders"
          onExportCSV={exportToCSV}
          onExportExcel={exportToExcel}
          onExportPDF={exportToPDF}
        />

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
      </CardContent>
    </Card>
  );
};

export default OrdersRecords;
