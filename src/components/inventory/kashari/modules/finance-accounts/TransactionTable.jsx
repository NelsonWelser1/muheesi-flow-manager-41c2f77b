
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const TransactionTable = ({ transactions, isLoading, handleEdit, handleDelete }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  // Format amount with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-4">No transactions found. Add a transaction to get started.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount (UGX)</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
              <TableCell>
                <Badge className={
                  transaction.transaction_type === 'Income' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                  transaction.transaction_type === 'Expense' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                  'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }>
                  {transaction.transaction_type}
                </Badge>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className={
                transaction.transaction_type === 'Income' ? 'text-green-600' : 
                transaction.transaction_type === 'Expense' ? 'text-red-600' : ''
              }>
                {formatAmount(transaction.amount)}
              </TableCell>
              <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
              <TableCell>
                <Badge className={
                  transaction.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                  transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                  'bg-red-100 text-red-800 hover:bg-red-200'
                }>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{transaction.description || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
