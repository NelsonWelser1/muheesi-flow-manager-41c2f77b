
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SalesTable = ({ salesData }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesData.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.date}</TableCell>
            <TableCell>{sale.product}</TableCell>
            <TableCell>{sale.quantity} {sale.unit}</TableCell>
            <TableCell>UGX {sale.unitPrice.toLocaleString()}</TableCell>
            <TableCell>UGX {sale.totalAmount.toLocaleString()}</TableCell>
            <TableCell>{sale.customer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SalesTable;
