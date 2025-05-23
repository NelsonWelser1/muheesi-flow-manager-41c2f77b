
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePagination } from '../hooks/usePagination';
import { OffloadRecordsTable } from './OffloadRecordsTable';
import ExportOptions from './ExportOptions';
import { PaginationControls } from './PaginationControls';

export const RecentOffloadRecords = ({
  records,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  console.log('RecentOffloadRecords received records:', records);

  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Milk Offload Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No offload records found</p>
            <p className="text-sm mt-2">Start by creating some milk tank offload entries</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter records to show only offload records (negative volume or specific offload indicators)
  const filteredRecords = records
    .filter(record => {
      console.log('Filtering record:', record);
      
      // Check if this is an offload record by looking for:
      // 1. Negative milk_volume (from milk_reception table)
      // 2. volume_offloaded field (from milk_tank_offloads table)
      // 3. supplier_name containing 'Offload from'
      const isOffloadRecord = 
        (record.milk_volume && Number(record.milk_volume) < 0) ||
        (record.volume_offloaded && Number(record.volume_offloaded) > 0) ||
        (record.supplier_name && record.supplier_name.includes('Offload from'));
      
      console.log('Is offload record?', isOffloadRecord);
      return isOffloadRecord;
    })
    .filter(record => !record.batch_id?.startsWith('LEGACY-'))
    .sort((a, b) => new Date(b.created_at || b.datetime) - new Date(a.created_at || a.datetime));

  console.log('Filtered offload records:', filteredRecords);

  const {
    paginatedItems: paginatedRecords,
    currentPage,
    totalPages,
    startIndex,
    pageSize,
    totalItems,
    handlePageChange
  } = usePagination(filteredRecords, 10);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({
        title: "Refreshed Successfully",
        description: "Offload records have been updated",
        duration: 3000,
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh offload records",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Milk Offload Records ({filteredRecords.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ExportOptions records={filteredRecords} />
          
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No offload records found</p>
              <p className="text-sm mt-2">All records appear to be milk reception entries</p>
            </div>
          ) : (
            <>
              <OffloadRecordsTable records={paginatedRecords} />
              
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                startIndex={startIndex}
                pageSize={pageSize}
                totalItems={totalItems}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
