
import React, { useState } from 'react';
import { format as formatDate } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const RECORDS_PER_PAGE = 10;

const ProductionTable = ({ records }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!records?.length) {
    return <div className="text-center py-4">No records found</div>;
  }

  // Sort records by created_at in descending order (most recent first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedRecords.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentRecords = sortedRecords.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Batch ID</TableHead>
              <TableHead className="whitespace-nowrap">Offload Batch ID</TableHead>
              <TableHead className="whitespace-nowrap">Fromager</TableHead>
              <TableHead className="whitespace-nowrap">Cheese Type</TableHead>
              <TableHead className="whitespace-nowrap">Milk Volume (L)</TableHead>
              <TableHead className="whitespace-nowrap">Start Time</TableHead>
              <TableHead className="whitespace-nowrap">Duration (hrs)</TableHead>
              <TableHead className="whitespace-nowrap">Starter Culture</TableHead>
              <TableHead className="whitespace-nowrap">Starter Qty (g)</TableHead>
              <TableHead className="whitespace-nowrap">Coagulant Type</TableHead>
              <TableHead className="whitespace-nowrap">Coagulant Qty (ml)</TableHead>
              <TableHead className="whitespace-nowrap">Temp (°C)</TableHead>
              <TableHead className="whitespace-nowrap">Process Time (min)</TableHead>
              <TableHead className="whitespace-nowrap">Expected Yield (kg)</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Notes</TableHead>
              <TableHead className="whitespace-nowrap">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/50">
                <TableCell className="whitespace-nowrap font-medium">{record.batch_id}</TableCell>
                <TableCell className="whitespace-nowrap">{record.offload_batch_id}</TableCell>
                <TableCell className="whitespace-nowrap">{record.fromager_identifier}</TableCell>
                <TableCell className="whitespace-nowrap">{record.cheese_type}</TableCell>
                <TableCell className="whitespace-nowrap">{record.milk_volume}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(new Date(record.start_time), 'PPp')}
                </TableCell>
                <TableCell className="whitespace-nowrap">{record.estimated_duration}</TableCell>
                <TableCell className="whitespace-nowrap">{record.starter_culture}</TableCell>
                <TableCell className="whitespace-nowrap">{record.starter_quantity}</TableCell>
                <TableCell className="whitespace-nowrap">{record.coagulant_type}</TableCell>
                <TableCell className="whitespace-nowrap">{record.coagulant_quantity}</TableCell>
                <TableCell className="whitespace-nowrap">{record.processing_temperature}</TableCell>
                <TableCell className="whitespace-nowrap">{record.processing_time}</TableCell>
                <TableCell className="whitespace-nowrap">{record.expected_yield}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    record.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis" title={record.notes}>
                  {record.notes}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(new Date(record.created_at), 'PPp')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedRecords.length)} of {sortedRecords.length} records
        </div>
        
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
};

export default ProductionTable;
