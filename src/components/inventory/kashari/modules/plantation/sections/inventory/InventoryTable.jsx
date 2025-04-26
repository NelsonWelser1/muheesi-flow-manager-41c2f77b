
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

const InventoryTable = ({ inventory, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading inventory data...</p>
      </div>
    );
  }
  
  if (!inventory || inventory.length === 0) {
    return (
      <div className="py-10 text-center">
        <p>No inventory items found. Add some items to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.product}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{item.unit}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.date ? format(new Date(item.date), 'MMM d, yyyy') : 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
