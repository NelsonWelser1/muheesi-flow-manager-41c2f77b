
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { format } from 'date-fns';

const RECORDS_PER_PAGE = 10;

const InventoryTable = ({ items, itemStatuses, getStatusColor, handleStatusChange, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort items by creation date (most recent first)
  const sortedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [items]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedItems.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="text-muted-foreground">Loading inventory items...</div>
      </div>
    );
  }

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No inventory items found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Item Name</TableHead>
              <TableHead className="whitespace-nowrap">Section</TableHead>
              <TableHead className="whitespace-nowrap">Quantity</TableHead>
              <TableHead className="whitespace-nowrap">Unit Cost</TableHead>
              <TableHead className="whitespace-nowrap">Total Cost</TableHead>
              <TableHead className="whitespace-nowrap">Supplier</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Date Added</TableHead>
              <TableHead className="whitespace-nowrap">Notes</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {item.item_name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.section}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.quantity}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  UGX {Number(item.unit_cost).toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  UGX {Number(item.total_cost || 0).toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.supplier_details || '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={getStatusColor(item.status)}>
                    {itemStatuses[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy') : '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                  {item.notes || '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Select
                    value={item.status}
                    onValueChange={(value) => handleStatusChange(item.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(itemStatuses).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedItems.length)} of {sortedItems.length} items
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
