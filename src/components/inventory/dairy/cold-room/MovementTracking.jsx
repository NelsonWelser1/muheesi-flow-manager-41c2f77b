import React, { useEffect, useState } from 'react';
import { useColdRoomInventory } from './hooks/useColdRoomInventory';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import SearchToolbar from './components/SearchToolbar';

const MovementTracking = () => {
  const { inventoryItems, loading, error, fetchInventory } = useColdRoomInventory();
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'in', 'out'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(inventoryItems);
    } else {
      setFilteredItems(
        inventoryItems.filter(item => 
          item.movement_action.toLowerCase() === filter
        )
      );
    }
  }, [inventoryItems, filter]);

  const columns = [
    { header: 'Date & Time', accessorKey: 'storage_date_time' },
    { header: 'Action', accessorKey: 'movement_action' },
    { header: 'Product', accessorKey: 'product_type' },
    { header: 'Batch ID', accessorKey: 'batch_id' },
    { header: 'Cold Room', accessorKey: 'cold_room_id' },
    { header: 'Quantity', accessorKey: 'unit_quantity' },
    { header: 'Operator', accessorKey: 'operator_id' }
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
    let filtered = [...filteredItems];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.storage_date_time);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [filteredItems, searchTerm, sortConfig, dateRange]);

  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px] mt-1" />
        </TableCell>
        <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Movement History</h2>
        <div className="flex space-x-2">
          <Badge 
            className={`cursor-pointer ${filter === 'all' ? 'bg-primary' : 'bg-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </Badge>
          <Badge 
            className={`cursor-pointer ${filter === 'in' ? 'bg-green-600' : 'bg-secondary'}`}
            onClick={() => setFilter('in')}
          >
            Goods Receipt
          </Badge>
          <Badge 
            className={`cursor-pointer ${filter === 'out' ? 'bg-amber-600' : 'bg-secondary'}`}
            onClick={() => setFilter('out')}
          >
            Goods Issue
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <SearchToolbar
            onSearch={handleSearch}
            onRefresh={fetchInventory}
            onDateRangeChange={handleDateRangeChange}
            data={filteredAndSortedData}
            columns={columns}
            tableTitle="Movement History"
            loading={loading}
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
                {loading ? (
                  renderSkeletonRows()
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4 text-red-500">
                      Error loading movements: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>{format(new Date(item.storage_date_time), 'PPp')}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            item.movement_action.toLowerCase() === 'in' 
                              ? 'bg-green-600' 
                              : 'bg-amber-600'
                          }
                        >
                          {item.movement_action.toLowerCase() === 'in' ? 'Goods Receipt' : 'Goods Issue'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.product_type}
                        <span className="block text-xs text-muted-foreground capitalize">
                          {item.product_category}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.batch_id}
                        {item.production_batch_id && (
                          <span className="block text-xs text-muted-foreground">
                            Prod: {item.production_batch_id}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{item.cold_room_id}</TableCell>
                      <TableCell className="text-right">
                        {item.unit_quantity} × {item.unit_weight}g
                      </TableCell>
                      <TableCell>{item.operator_id}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4">
                      No movement records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .movement-table,
          .movement-table * {
            visibility: visible;
          }
          .movement-table {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MovementTracking;
