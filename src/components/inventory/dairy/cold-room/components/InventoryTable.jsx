
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const InventoryTable = ({ isLoading, error, filteredAndSortedData, columns, sortConfig, handleSort }) => {
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
    <div className="relative min-h-[400px] inventory-table">
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
  );
};

export default InventoryTable;
