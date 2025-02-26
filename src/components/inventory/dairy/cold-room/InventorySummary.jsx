import React, { useEffect, useState } from 'react';
import { useColdRoomInventory } from './hooks/useColdRoomInventory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import SearchToolbar from './components/SearchToolbar';

const InventorySummary = () => {
  const { loading, error, getStockLevelsByBatch } = useColdRoomInventory();
  const [stockByBatch, setStockByBatch] = useState({});
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    const fetchStockLevels = async () => {
      setIsLoading(true);
      try {
        const stockData = await getStockLevelsByBatch();
        setStockByBatch(stockData);
        
        // Convert object to array for easier rendering
        const stockArray = Object.values(stockData).filter(item => item.current > 0);
        setStockList(stockArray);
      } catch (err) {
        console.error('Error in InventorySummary:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockLevels();
    
    // Set up interval for periodic refresh
    const intervalId = setInterval(fetchStockLevels, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [getStockLevelsByBatch]);

  const columns = [
    { header: 'Batch ID', accessorKey: 'batch_id' },
    { header: 'Product Type', accessorKey: 'product_type' },
    { header: 'Product Category', accessorKey: 'product_category' },
    { header: 'Cold Room', accessorKey: 'cold_room_id' },
    { header: 'Received', accessorKey: 'received' },
    { header: 'Issued', accessorKey: 'issued' },
    { header: 'Current', accessorKey: 'current' },
    { header: 'Last Updated', accessorKey: 'lastUpdated' }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = [...stockList];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.lastUpdated);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [stockList, searchTerm, sortConfig, dateRange]);

  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-3 w-[80px] mt-1" />
        </TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Cold Room Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchToolbar
            onSearch={handleSearch}
            onRefresh={fetchStockLevels}
            onDateRangeChange={handleDateRangeChange}
            data={filteredAndSortedData}
            columns={columns}
            tableTitle="Cold Room Inventory"
            loading={isLoading}
          />

          <div className="relative min-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(column => (
                    <TableHead
                      key={column.accessorKey}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      {column.header}
                      {sortConfig.key === column.accessorKey && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4 text-red-500">
                      Error loading inventory: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((item, index) => (
                    <TableRow key={item.batch_id || index}>
                      <TableCell className="font-mono text-xs">
                        {item.batch_id}
                        {item.production_batch_id && (
                          <span className="block text-xs text-muted-foreground">
                            Prod: {item.production_batch_id}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{item.product_type}</TableCell>
                      <TableCell className="capitalize">{item.product_category}</TableCell>
                      <TableCell>{item.cold_room_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item.received}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {item.issued}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary">
                          {item.current}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.lastUpdated ? format(new Date(item.lastUpdated), 'PPp') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .inventory-table,
          .inventory-table * {
            visibility: visible;
          }
          .inventory-table {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InventorySummary;
