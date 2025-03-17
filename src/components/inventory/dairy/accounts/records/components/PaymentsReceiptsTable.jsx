
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
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Mail, 
  Download, 
  Eye 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

const PaymentsReceiptsTable = ({ records, loading }) => {
  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      </TableRow>
    ));
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleGenerateReceipt = (record) => {
    console.log("Generate receipt for:", record);
    // Implementation for generating receipt
  };

  const handleEmailReceipt = (record) => {
    console.log("Email receipt for:", record);
    // Implementation for emailing receipt
  };

  const handleDownloadPdf = (record) => {
    console.log("Download PDF for:", record);
    // Implementation for downloading PDF
  };

  const handleViewDetails = (record) => {
    console.log("View details for:", record);
    // Implementation for viewing details
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderSkeletonRows()
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No payment records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.payment_number}</TableCell>
                <TableCell>{format(new Date(record.payment_date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {record.payment_type === 'received' ? 'Receipt' : 'Payment'}
                  </Badge>
                </TableCell>
                <TableCell>{record.party_name}</TableCell>
                <TableCell>{formatCurrency(record.amount, record.currency)}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusBadgeColor(record.status)} capitalize`}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDetails(record)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleGenerateReceipt(record)}
                      title="Generate Receipt"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEmailReceipt(record)}
                      title="Email Receipt"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownloadPdf(record)}
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsReceiptsTable;
