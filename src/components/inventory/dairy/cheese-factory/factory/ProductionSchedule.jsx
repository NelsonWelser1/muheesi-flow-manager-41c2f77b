
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const ProductionSchedule = ({ batches }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Raw Milk Used</TableHead>
            <TableHead>Yield</TableHead>
            <TableHead>Quality Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches?.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell>{batch.batch_number}</TableCell>
              <TableCell className="capitalize">{batch.product_type}</TableCell>
              <TableCell>{format(new Date(batch.start_time), 'PPp')}</TableCell>
              <TableCell>
                {batch.end_time ? format(new Date(batch.end_time), 'PPp') : 'In Progress'}
              </TableCell>
              <TableCell>{batch.raw_milk_used} L</TableCell>
              <TableCell>{batch.actual_yield || '-'} L</TableCell>
              <TableCell>
                <Badge className={getStatusColor(batch.quality_status)}>
                  {batch.quality_status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductionSchedule;
