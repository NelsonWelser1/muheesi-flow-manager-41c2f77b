import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, RefreshCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMilkReception } from '@/hooks/useMilkReception';
import { Droplet, Thermometer, Volume } from 'lucide-react';
import { usePagination } from './hooks/usePagination';
import CollapsibleColumnHeader from './components/CollapsibleColumnHeader';
import PaginationControls from './components/PaginationControls';
import ExportOptions from './components/ExportOptions';

// Add import for the calculateTankBalance utility
const calculateTankBalance = (tankName, milkReceptionData) => {
  if (!milkReceptionData || !Array.isArray(milkReceptionData)) {
    return { volume: 0, lastTemperature: 0 };
  }

  const tankRecords = milkReceptionData.filter(record => 
    record && record.tank_number && record.tank_number.trim().toLowerCase() === tankName.trim().toLowerCase()
  );

  if (tankRecords.length === 0) {
    return { volume: 0, lastTemperature: 0 };
  }

  const tankData = tankRecords.reduce((acc, record) => {
    if (record && record.milk_volume !== null && record.milk_volume !== undefined) {
      const volumeValue = Number(record.milk_volume);
      if (!isNaN(volumeValue)) {
        acc.volume += volumeValue;
      }
    }
    
    if (record && record.temperature !== null && record.temperature !== undefined && 
        (!acc.lastTimestamp || new Date(record.created_at) > new Date(acc.lastTimestamp))) {
      const tempValue = Number(record.temperature);
      if (!isNaN(tempValue)) {
        acc.lastTemperature = tempValue;
        acc.lastTimestamp = record.created_at;
      }
    }
    return acc;
  }, { volume: 0, lastTemperature: 0, lastTimestamp: null });

  return {
    volume: Math.max(0, tankData.volume),
    lastTemperature: tankData.lastTemperature
  };
};

const MilkReceptionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  
  const { data: milkReceptionData, isLoading, error, refetch } = useMilkReception();
  
  const [filteredData, setFilteredData] = useState([]);
  const { currentPage, itemsPerPage, totalPages, setCurrentPage, paginate } = usePagination(filteredData);

  // Calculate tank balances
  const tankA = calculateTankBalance('Tank A', milkReceptionData);
  const tankB = calculateTankBalance('Tank B', milkReceptionData);
  const directProcessing = calculateTankBalance('Direct-Processing', milkReceptionData);
  
  // Calculate total volume with explicit number conversions
  const tankAVolume = parseFloat(tankA.volume) || 0;
  const tankBVolume = parseFloat(tankB.volume) || 0; 
  const directProcessingVolume = parseFloat(directProcessing.volume) || 0;
  
  const totalVolume = tankAVolume + tankBVolume + directProcessingVolume;

  useEffect(() => {
    // Filtering logic
    let initialData = milkReceptionData || [];

    if (searchTerm) {
      initialData = initialData.filter(item =>
        Object.values(item).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterValue !== 'all') {
      initialData = initialData.filter(item => item.quality_score === filterValue);
    }

    // Sorting logic
    if (sortConfig) {
      initialData = [...initialData].sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        const key = sortConfig.key;

        // Handle potential undefined values
        const valueA = a[key] === undefined ? '' : a[key];
        const valueB = b[key] === undefined ? '' : b[key];

        if (valueA < valueB) {
          return -1 * direction;
        }
        if (valueA > valueB) {
          return 1 * direction;
        }
        return 0;
      });
    }

    setFilteredData(initialData);
    setCurrentPage(1); // Reset to first page after filtering/sorting
  }, [milkReceptionData, searchTerm, filterValue, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig && prevConfig.key === key && prevConfig.direction === 'asc') {
        return { key: key, direction: 'desc' };
      } else {
        return { key: key, direction: 'asc' };
      }
    });
  };

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const dateTimeFormatter = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Milk Volume Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-lg font-medium">Tank A Status</CardTitle>
            <Droplet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Volume:</span>
                <span className="text-lg font-bold text-blue-600">{tankAVolume.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-bold text-gray-700">{tankA.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-lg font-medium">Tank B Status</CardTitle>
            <Droplet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Volume:</span>
                <span className="text-lg font-bold text-green-600">{tankBVolume.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-bold text-gray-700">{tankB.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-lg font-medium">Direct Processing</CardTitle>
            <Droplet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Volume:</span>
                <span className="text-lg font-bold text-purple-600">{directProcessingVolume.toFixed(2)}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-bold text-gray-700">{directProcessing.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">
              {totalVolume.toFixed(2)}L
            </div>
            <p className="text-xs text-muted-foreground">
              Combined volume across all tanks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filter Select */}
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Qualities</SelectItem>
            <SelectItem value="Grade A">Grade A</SelectItem>
            <SelectItem value="Grade B">Grade B</SelectItem>
            <SelectItem value="Grade C">Grade C</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <CollapsibleColumnHeader
                title="Batch ID"
                sortKey="batch_id"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Supplier"
                sortKey="supplier_name"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Volume (L)"
                sortKey="milk_volume"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Temperature (°C)"
                sortKey="temperature"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Quality"
                sortKey="quality_score"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Tank #"
                sortKey="tank_number"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Destination"
                sortKey="destination"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
              <CollapsibleColumnHeader
                title="Date & Time"
                sortKey="created_at"
                handleSort={handleSort}
                renderSortIcon={renderSortIcon}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginate(filteredData).map(row => (
              <tr key={row.id}>
                <td className="px-4 py-2 whitespace-nowrap">{row.batch_id}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.supplier_name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.milk_volume}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.temperature}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.quality_score}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.tank_number}</td>
                 <td className="px-4 py-2 whitespace-nowrap">{row.destination}</td>
                <td className="px-4 py-2 whitespace-nowrap">{dateTimeFormatter(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Export Options */}
      <ExportOptions data={filteredData} />
    </div>
  );
};

export default MilkReceptionTable;
