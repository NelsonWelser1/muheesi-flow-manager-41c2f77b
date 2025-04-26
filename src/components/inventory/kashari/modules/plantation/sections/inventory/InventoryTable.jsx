
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InventoryTable = ({ inventory }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.product}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.unit}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
