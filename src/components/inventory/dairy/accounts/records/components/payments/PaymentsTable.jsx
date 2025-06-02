
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { format, parseISO } from 'date-fns';
import { usePaymentsPagination } from '../../hooks/usePaymentsPagination';

const PaymentsTable = ({ records, loading }) => {
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
    return <div className="w-full text-center py-8">Loading records...</div>;
  }

  if (!records || records.length === 0) {
    return <div className="w-full text-center py-8">No records found.</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDateSafely = (dateString) => {
    try {
      if (!dateString) return '-';
      
      if (typeof dateString === 'string' && dateString.includes('T')) {
        return format(new Date(dateString), 'dd/MM/yyyy');
      }
      
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString || '-';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Number</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Method</TableHead>
              <TableHead className="whitespace-nowrap">Reference</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="whitespace-nowrap">{record.paymentNumber}</TableCell>
                <TableCell className="capitalize whitespace-nowrap">{record.paymentType}</TableCell>
                <TableCell className="whitespace-nowrap">{record.partyName}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDateSafely(record.paymentDate)}</TableCell>
                <TableCell className="whitespace-nowrap">{formatAmount(record.amount, record.currency)}</TableCell>
                <TableCell className="capitalize whitespace-nowrap">{record.paymentMethod.replace('_', ' ')}</TableCell>
                <TableCell className="whitespace-nowrap">{record.referenceNumber || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{getStatusBadge(record.status)}</TableCell>
              </TableRow>
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

export default PaymentsTable;
