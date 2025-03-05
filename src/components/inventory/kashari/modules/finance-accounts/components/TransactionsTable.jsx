
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const TransactionsTable = ({ transactions, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-4">No transactions found.</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'income':
        return "text-green-600 font-medium";
      case 'expense':
        return "text-red-600 font-medium";
      case 'transfer':
        return "text-blue-600 font-medium";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {transaction.transaction_date ? 
                  format(new Date(transaction.transaction_date), 'MMM dd, yyyy') : 
                  'N/A'}
              </TableCell>
              <TableCell className={getTypeStyles(transaction.transaction_type)}>
                {transaction.transaction_type}
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{transaction.reference_number || 'N/A'}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
