
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useCurrencyFormatter } from "./hooks/useCurrencyFormatter";
import { usePaymentsPagination } from '../../hooks/usePaymentsPagination';
import PayrollTableHeader from './components/PayrollTableHeader';
import PayrollTableRow from './components/PayrollTableRow';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';

const PayrollTable = ({ records, loading }) => {
  const { formatCurrency } = useCurrencyFormatter();
  
  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePaymentsPagination(records, 10);

  if (loading) {
    return <LoadingState />;
  }

  if (records.length === 0) {
    return <EmptyState message="No payroll records found." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <PayrollTableHeader />
          <TableBody>
            {paginatedData.map(record => (
              <PayrollTableRow 
                key={record.id} 
                record={record} 
                formatCurrency={formatCurrency} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
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

export default PayrollTable;
