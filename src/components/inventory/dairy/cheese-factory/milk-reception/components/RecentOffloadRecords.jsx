import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePagination } from '../hooks/usePagination';
import { OffloadRecordsTable } from './OffloadRecordsTable';
import { ExportActions } from './ExportActions';
import { PaginationControls } from './PaginationControls';

export const RecentOffloadRecords = ({
  records,
  onRefresh
}) => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

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
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter records (same logic as original)
  const filteredRecords = records
    .filter(record => 
      record && 
      record.created_at && 
      record.volume_offloaded !== undefined && 
      record.volume_offloaded !== null && 
      Number(record.volume_offloaded) > 0 && (
        !record.supplier_name || 
        record.supplier_name.includes('Offload from')
      )
    )
    .filter(record => !record.batch_id?.startsWith('LEGACY-'));

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

  const handleReportGenerated = (data) => {
    setReportData(data);
    setShowReport(true);
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
        {!showReport ? (
          <div className="space-y-4">
            <ExportActions 
              records={filteredRecords} 
              onReportGenerated={handleReportGenerated} 
            />
            
            <OffloadRecordsTable records={paginatedRecords} />
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              startIndex={startIndex}
              pageSize={pageSize}
              totalItems={totalItems}
            />
          </div>
        ) : (
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Offload Records Report</h3>
              <Button onClick={() => setShowReport(false)} variant="outline" size="sm">
                Back to Records
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700">Total Records</h4>
                <p className="text-2xl font-bold text-blue-900">{reportData.totalRecords}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700">Total Volume Offloaded</h4>
                <p className="text-2xl font-bold text-red-900">{reportData.totalVolume.toFixed(1)}L</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700">Avg Temperature</h4>
                <p className="text-2xl font-bold text-green-900">{reportData.averageTemperature.toFixed(1)}°C</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700">Avg Fat Content</h4>
                <p className="text-2xl font-bold text-purple-900">{reportData.averageFat.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Tanks Used</h4>
                <ul className="list-disc list-inside">
                  {reportData.tanks.map((tank, index) => (
                    <li key={index} className="text-gray-700">{tank}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Destinations</h4>
                <ul className="list-disc list-inside">
                  {reportData.destinations.map((destination, index) => (
                    <li key={index} className="text-gray-700">{destination}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
