
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Check, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const PaymentsTable = ({ records, loading }) => {
  const [page, setPage] = React.useState(1);
  const recordsPerPage = 10;
  
  if (loading) {
    return <div className="text-center py-8">Loading payment records...</div>
  }
  
  if (!records || records.length === 0) {
    return <div className="text-center py-8">No payment records found</div>
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (page - 1) * recordsPerPage;
  const paginatedRecords = records.slice(startIndex, startIndex + recordsPerPage);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500"><AlertTriangle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPaymentTypeIcon = (type) => {
    if (type === 'received') {
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };
  
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-UG', { 
      style: 'currency', 
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Type</TableHead>
              <TableHead>Payment Number</TableHead>
              <TableHead>{records[0]?.paymentType === 'received' ? 'Payer' : 'Payee'}</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={record.id || index} className="hover:bg-muted/50">
                <TableCell>{getPaymentTypeIcon(record.paymentType)}</TableCell>
                <TableCell className="font-medium">{record.paymentNumber}</TableCell>
                <TableCell>{record.partyName}</TableCell>
                <TableCell>
                  {record.paymentDate ? format(new Date(record.paymentDate), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {record.paymentMethod?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(record.amount, record.currency)}
                </TableCell>
                <TableCell>{record.referenceNumber || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  onClick={() => setPage(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaymentsTable;
