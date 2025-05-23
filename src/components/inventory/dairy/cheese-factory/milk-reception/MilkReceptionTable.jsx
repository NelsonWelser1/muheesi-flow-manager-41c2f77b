import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';
import { usePagination } from './hooks/usePagination';
import { PaginationControls } from './components/PaginationControls';
import CollapsibleColumnHeader from './components/CollapsibleColumnHeader';
import { format } from 'date-fns';

const MilkReceptionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: records, isLoading, error } = useMilkReception();
  const { toast } = useToast();

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    batchId: true,
    supplier: true,
    storageTank: true,
    volume: true,
    temperature: true,
    fat: true,
    protein: true,
    quality: true,
    dateTime: true
  });

  const toggleColumn = (columnKey) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Filter records based on search term
  const filteredRecords = records?.filter(record => 
    record.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tank_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Use pagination hook
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
    setIsRefreshing(true);
    try {
      // Trigger a refetch by clearing and refetching data
      window.location.reload();
      toast({
        title: "Refreshed Successfully",
        description: "Milk reception records have been updated",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh milk reception records",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Milk Reception Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading milk reception records...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Milk Reception Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>Error loading milk reception records: {error.message}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Milk Reception Records ({totalItems})
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
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
          {/* Color Legend */}
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border-l-4 border-green-500 rounded"></div>
              <span>Milk Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border-l-4 border-red-500 rounded"></div>
              <span>Milk Offloaded</span>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[150px] font-semibold"
                    isVisible={columnVisibility.batchId}
                    onToggle={() => toggleColumn('batchId')}
                  >
                    Batch ID
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[150px] font-semibold"
                    isVisible={columnVisibility.supplier}
                    onToggle={() => toggleColumn('supplier')}
                  >
                    Supplier
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[120px] font-semibold"
                    isVisible={columnVisibility.storageTank}
                    onToggle={() => toggleColumn('storageTank')}
                  >
                    Storage Tank
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[120px] font-semibold"
                    isVisible={columnVisibility.volume}
                    onToggle={() => toggleColumn('volume')}
                  >
                    Volume (L)
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[120px] font-semibold"
                    isVisible={columnVisibility.temperature}
                    onToggle={() => toggleColumn('temperature')}
                  >
                    Temperature (°C)
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[110px] font-semibold"
                    isVisible={columnVisibility.fat}
                    onToggle={() => toggleColumn('fat')}
                  >
                    Fat %
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[120px] font-semibold"
                    isVisible={columnVisibility.protein}
                    onToggle={() => toggleColumn('protein')}
                  >
                    Protein %
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[120px] font-semibold"
                    isVisible={columnVisibility.quality}
                    onToggle={() => toggleColumn('quality')}
                  >
                    Quality
                  </CollapsibleColumnHeader>
                  <CollapsibleColumnHeader
                    className="whitespace-nowrap px-6 min-w-[130px] font-semibold"
                    isVisible={columnVisibility.dateTime}
                    onToggle={() => toggleColumn('dateTime')}
                  >
                    Date & Time
                  </CollapsibleColumnHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No records match your search criteria' : 'No milk reception records found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map(record => {
                    // Determine if this is an offload record (negative volume or has volume_offloaded field)
                    const isOffload = record.volume_offloaded || (record.milk_volume && record.milk_volume < 0);
                    const rowColorClass = isOffload ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500';
                    
                    return (
                      <TableRow key={record.id} className={rowColorClass}>
                        {columnVisibility.batchId && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[150px] font-medium">
                            {record.batch_id || 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.supplier && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[150px]">
                            {record.supplier_name || 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.storageTank && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                            {record.tank_number || 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.volume && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[120px] font-medium">
                            {isOffload ? (
                              <span className="text-red-600">
                                -{Math.abs(record.volume_offloaded || record.milk_volume)}L
                              </span>
                            ) : (
                              <span className="text-green-600">
                                {record.milk_volume ? `${record.milk_volume}L` : 'N/A'}
                              </span>
                            )}
                          </TableCell>
                        )}
                        {columnVisibility.temperature && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                            {record.temperature ? `${record.temperature}°C` : 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.fat && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[110px]">
                            {record.fat_percentage ? `${record.fat_percentage}%` : 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.protein && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                            {record.protein_percentage ? `${record.protein_percentage}%` : 'N/A'}
                          </TableCell>
                        )}
                        {columnVisibility.quality && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.quality_score === 'Grade A' ? 'bg-green-100 text-green-800' :
                              record.quality_score === 'Grade B' ? 'bg-yellow-100 text-yellow-800' :
                              record.quality_score === 'Grade C' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {record.quality_score || 'N/A'}
                            </span>
                          </TableCell>
                        )}
                        {columnVisibility.dateTime && (
                          <TableCell className="whitespace-nowrap px-6 min-w-[130px]">
                            {record.created_at ? format(new Date(record.created_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            startIndex={startIndex}
            pageSize={pageSize}
            totalItems={totalItems}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionTable;
