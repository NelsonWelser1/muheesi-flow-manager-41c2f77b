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
import { format, parseISO } from 'date-fns';

const PaymentsTable = ({ records, loading }) => {
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
      // Handle both date string and Date object formats
      if (!dateString) return '-';
      
      // If it's already a Date object or string in ISO format
      if (typeof dateString === 'string' && dateString.includes('T')) {
        return format(new Date(dateString), 'dd/MM/yyyy');
      }
      
      // Otherwise (simple date string like '2023-04-01')
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString || '-'; // Return original string or placeholder if formatting fails
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.paymentNumber}</TableCell>
              <TableCell className="capitalize">{record.paymentType}</TableCell>
              <TableCell>{record.partyName}</TableCell>
              <TableCell>{formatDateSafely(record.paymentDate)}</TableCell>
              <TableCell>{formatAmount(record.amount, record.currency)}</TableCell>
              <TableCell className="capitalize">{record.paymentMethod.replace('_', ' ')}</TableCell>
              <TableCell>{record.referenceNumber || '-'}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
