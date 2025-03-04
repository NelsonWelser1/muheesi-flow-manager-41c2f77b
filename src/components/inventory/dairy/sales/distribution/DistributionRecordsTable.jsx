
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DistributionRecordsTable = ({ records = [], isLoading = false }) => {
  if (isLoading) {
    return <div className="py-4 text-center text-gray-500">Loading distribution records...</div>;
  }

  if (!records.length) {
    return <div className="py-4 text-center text-gray-500">No distribution records found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{new Date(record.deliveryDate).toLocaleDateString()}</TableCell>
            <TableCell>{record.customer}</TableCell>
            <TableCell>{record.product}</TableCell>
            <TableCell>{record.quantity} {record.unit}</TableCell>
            <TableCell>UGX {record.price.toLocaleString()}</TableCell>
            <TableCell>UGX {(record.price * record.quantity).toLocaleString()}</TableCell>
            <TableCell>
              <Badge className={
                record.status === 'delivered' ? 'bg-green-500' :
                record.status === 'pending' ? 'bg-yellow-500' :
                'bg-red-500'
              }>
                {record.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DistributionRecordsTable;
