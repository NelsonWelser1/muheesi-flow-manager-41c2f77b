import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InvoiceList = () => {
  // Mock data for demonstration
  const invoices = [
    { id: 'INV001', date: '2024-03-27', customer: 'John Doe', amount: '$1,500', status: 'Pending' },
    { id: 'INV002', date: '2024-03-28', customer: 'Jane Smith', amount: '$2,300', status: 'Paid' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>{invoice.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceList;