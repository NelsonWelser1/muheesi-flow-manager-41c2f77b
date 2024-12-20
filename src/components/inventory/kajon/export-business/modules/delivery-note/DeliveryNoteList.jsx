import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DeliveryNoteList = () => {
  // Mock data for demonstration
  const deliveryNotes = [
    { id: 'DN001', date: '2024-03-27', customer: 'John Doe', status: 'Pending', items: '3 items' },
    { id: 'DN002', date: '2024-03-28', customer: 'Jane Smith', status: 'In Transit', items: '2 items' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Delivery Note #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveryNotes.map((note) => (
          <TableRow key={note.id}>
            <TableCell>{note.id}</TableCell>
            <TableCell>{note.date}</TableCell>
            <TableCell>{note.customer}</TableCell>
            <TableCell>{note.status}</TableCell>
            <TableCell>{note.items}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DeliveryNoteList;