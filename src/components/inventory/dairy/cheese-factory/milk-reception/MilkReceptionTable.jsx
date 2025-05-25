
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Thermometer, Droplets } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePagination } from './hooks/usePagination';
import CollapsibleColumnHeader from './components/CollapsibleColumnHeader';
import { PaginationControls } from './components/PaginationControls';
import ExportOptions from './components/ExportOptions';
import { useMilkReception } from '@/hooks/useMilkReception';

const MilkReceptionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Fetch data using the hook
  const { data: records = [], isLoading, error, refetch } = useMilkReception();

  // Calculate tank balances and temperatures
  const calculateTankMetrics = (tankName) => {
    if (!records) return { balance: 0, lastTemp: null };
    
    const tankRecords = records.filter(record => record.tank_number === tankName);
    const balance = tankRecords.reduce((total, record) => total + (record.milk_volume || 0), 0);
    const lastRecord = tankRecords
      .filter(record => record.temperature !== null)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    return { 
      balance: Math.max(0, balance), 
      lastTemp: lastRecord?.temperature || null 
    };
  };

  const tankAMetrics = calculateTankMetrics('Tank A');
  const tankBMetrics = calculateTankMetrics('Tank B');
  const directProcessingMetrics = calculateTankMetrics('Direct-Processing');
  const totalVolume = tankAMetrics.balance + tankBMetrics.balance + directProcessingMetrics.balance;

  // Filtering, sorting, and pagination logic
  const filteredRecords = useMemo(() => {
    if (!records) return [];
    return records.filter(record => 
      record.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tank_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.batch_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortConfig]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    startIndex,
    pageSize,
    totalItems,
    handlePageChange
  } = usePagination(sortedRecords, 10);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading data: {error.message}
              <Button onClick={handleRefresh} className="ml-4" variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tank Volume Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tank A</p>
                <p className="text-2xl font-bold">{tankAMetrics.balance.toFixed(1)}L</p>
                {tankAMetrics.lastTemp && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {tankAMetrics.lastTemp}°C
                  </div>
                )}
              </div>
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tank B</p>
                <p className="text-2xl font-bold">{tankBMetrics.balance.toFixed(1)}L</p>
                {tankBMetrics.lastTemp && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {tankBMetrics.lastTemp}°C
                  </div>
                )}
              </div>
              <Droplets className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Direct-Processing</p>
                <p className="text-2xl font-bold">{directProcessingMetrics.balance.toFixed(1)}L</p>
                {directProcessingMetrics.lastTemp && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {directProcessingMetrics.lastTemp}°C
                  </div>
                )}
              </div>
              <Droplets className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Volume</p>
                <p className="text-2xl font-bold">{totalVolume.toFixed(1)}L</p>
                <p className="text-sm text-gray-500">Combined</p>
              </div>
              <Droplets className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Milk Reception Records</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 min-w-[250px]"
                />
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <ExportOptions records={sortedRecords} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <CollapsibleColumnHeader 
                    title="Reception Date & Time" 
                    sortKey="created_at"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[160px]"
                  />
                  <CollapsibleColumnHeader 
                    title="Batch ID" 
                    sortKey="batch_id"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[120px]"
                  />
                  <CollapsibleColumnHeader 
                    title="Supplier Name" 
                    sortKey="supplier_name"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[140px]"
                  />
                  <CollapsibleColumnHeader 
                    title="Storage Tank" 
                    sortKey="tank_number"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[100px]"
                  />
                  <CollapsibleColumnHeader 
                    title="Milk Volume (Liters)" 
                    sortKey="milk_volume"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[120px]"
                  />
                  <CollapsibleColumnHeader 
                    title="Quality Grade" 
                    sortKey="quality_score"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    className="min-w-[100px]"
                  />
                  <TableHead className="min-w-[100px]">Temperature (°C)</TableHead>
                  <TableHead className="min-w-[100px]">Fat Content (%)</TableHead>
                  <TableHead className="min-w-[110px]">Protein Content (%)</TableHead>
                  <TableHead className="min-w-[120px]">Final Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading records...
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap font-medium min-w-[160px]">
                        {new Date(record.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm whitespace-nowrap min-w-[120px]">
                        {record.batch_id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap min-w-[140px]">{record.supplier_name}</TableCell>
                      <TableCell className="min-w-[100px]">
                        <Badge variant="outline" className="whitespace-nowrap">
                          {record.tank_number}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap min-w-[120px]">
                        <span className={record.milk_volume < 0 ? 'text-red-600' : 'text-green-600'}>
                          {record.milk_volume > 0 ? '+' : ''}{record.milk_volume}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <Badge 
                          variant={record.quality_score === 'Grade A' ? 'default' : 'secondary'}
                          className="whitespace-nowrap"
                        >
                          {record.quality_score}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap min-w-[100px]">{record.temperature}</TableCell>
                      <TableCell className="whitespace-nowrap min-w-[100px]">{record.fat_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap min-w-[110px]">{record.protein_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap min-w-[120px]">{record.destination}</TableCell>
                    </TableRow>
                  ))
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkReceptionTable;
