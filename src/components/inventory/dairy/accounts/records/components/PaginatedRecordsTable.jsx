
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Eye, FileText, Image, Download } from 'lucide-react';

const PaginatedRecordsTable = ({ 
  paginatedData, 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  handlePageChange, 
  loading 
}) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount, currency = 'UGX') => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return null;
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-green-500" />;
  };

  const handleFilePreview = (fileUrl) => {
    if (!fileUrl) return;
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      // Open image in a new window for preview
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(`
        <html>
          <head><title>File Preview</title></head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
            <img src="${fileUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain;" />
          </body>
        </html>
      `);
      previewWindow.document.close();
    } else {
      // For other file types, open directly
      window.open(fileUrl, '_blank');
    }
  };

  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Bill Number</TableHead>
              <TableHead className="whitespace-nowrap">Supplier</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Due Date</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Attachment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium whitespace-nowrap">{record.bill_number}</TableCell>
                  <TableCell className="whitespace-nowrap">{record.supplier_name}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(record.bill_date)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(record.due_date)}</TableCell>
                  <TableCell className="whitespace-nowrap">{record.expense_type}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(record.amount, record.currency)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusBadgeClass(record.status)}`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {record.receipt_url ? (
                      <div className="flex items-center gap-2">
                        {getFileIcon(record.receipt_url)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilePreview(record.receipt_url)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(record.receipt_url, '_blank')}
                            className="h-6 px-2 text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No records found
                </TableCell>
              </TableRow>
            )}
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

export default PaginatedRecordsTable;
