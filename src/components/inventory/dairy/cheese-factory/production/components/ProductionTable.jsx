
import React from 'react';
import { format as formatDate } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProductionTable = ({ records }) => {
  if (!records?.length) {
    return <div className="text-center py-4">No records found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Batch ID</TableHead>
            <TableHead className="whitespace-nowrap">Fromager</TableHead>
            <TableHead className="whitespace-nowrap">Cheese Type</TableHead>
            <TableHead className="whitespace-nowrap">Milk Volume (L)</TableHead>
            <TableHead className="whitespace-nowrap">Start Time</TableHead>
            <TableHead className="whitespace-nowrap">Duration (hrs)</TableHead>
            <TableHead className="whitespace-nowrap">Starter Culture</TableHead>
            <TableHead className="whitespace-nowrap">Starter Qty (g)</TableHead>
            <TableHead className="whitespace-nowrap">Coagulant Type</TableHead>
            <TableHead className="whitespace-nowrap">Coagulant Qty (ml)</TableHead>
            <TableHead className="whitespace-nowrap">Temp (°C)</TableHead>
            <TableHead className="whitespace-nowrap">Process Time (min)</TableHead>
            <TableHead className="whitespace-nowrap">Expected Yield (kg)</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Notes</TableHead>
            <TableHead className="whitespace-nowrap">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell className="whitespace-nowrap font-medium">{record.batch_id}</TableCell>
              <TableCell className="whitespace-nowrap">{record.fromager_identifier}</TableCell>
              <TableCell className="whitespace-nowrap">{record.cheese_type}</TableCell>
              <TableCell className="whitespace-nowrap">{record.milk_volume}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(new Date(record.start_time), 'PPp')}
              </TableCell>
              <TableCell className="whitespace-nowrap">{record.estimated_duration}</TableCell>
              <TableCell className="whitespace-nowrap">{record.starter_culture}</TableCell>
              <TableCell className="whitespace-nowrap">{record.starter_quantity}</TableCell>
              <TableCell className="whitespace-nowrap">{record.coagulant_type}</TableCell>
              <TableCell className="whitespace-nowrap">{record.coagulant_quantity}</TableCell>
              <TableCell className="whitespace-nowrap">{record.processing_temperature}</TableCell>
              <TableCell className="whitespace-nowrap">{record.processing_time}</TableCell>
              <TableCell className="whitespace-nowrap">{record.expected_yield}</TableCell>
              <TableCell className="whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  record.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={record.notes}>
                {record.notes}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(new Date(record.created_at), 'PPp')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductionTable;
