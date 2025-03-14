
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeliveryNoteList = () => {
  // Mock data for demonstration
  const deliveryNotes = [
    { id: 'DN001', date: '2024-03-27', customer: 'John Doe', status: 'Pending', items: '3 items' },
    { id: 'DN002', date: '2024-03-28', customer: 'Jane Smith', status: 'In Transit', items: '2 items' },
    { id: 'DN003', date: '2024-04-01', customer: 'Robert Brown', status: 'Delivered', items: '5 items' },
    { id: 'DN004', date: '2024-04-02', customer: 'Susan Johnson', status: 'Pending', items: '1 item' },
  ];

  // Get status badge color based on status
  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Pending</Badge>;
      case 'in transit':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="flex items-center">
                Delivery #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Date
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Customer
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryNotes.map((note) => (
            <TableRow key={note.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{note.id}</TableCell>
              <TableCell>{note.date}</TableCell>
              <TableCell>{note.customer}</TableCell>
              <TableCell>{getStatusBadge(note.status)}</TableCell>
              <TableCell>{note.items}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryNoteList;
