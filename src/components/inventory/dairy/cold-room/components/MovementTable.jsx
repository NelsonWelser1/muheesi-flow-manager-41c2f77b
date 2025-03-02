
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const MovementTable = ({ loading, error, filteredAndSortedData, columns, sortConfig, handleSort }) => {
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
    <div className="relative min-h-[400px] movement-table">
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
  );
};

export default MovementTable;
