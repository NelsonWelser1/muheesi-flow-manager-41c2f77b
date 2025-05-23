
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

export const OffloadRecordsTable = ({ records }) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="whitespace-nowrap px-6 min-w-[150px] font-semibold">Batch ID</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Storage Tank</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Volume (L)</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Temperature (°C)</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[110px] font-semibold">Fat %</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Protein %</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[130px] font-semibold">Date & Time</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Destination</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map(record => (
            <TableRow key={record.id}>
              <TableCell className="whitespace-nowrap px-6 min-w-[150px] font-medium">
                {record.batch_id || ''}
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.storage_tank}</TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[120px] text-red-600 font-medium">
                -{Math.abs(record.volume_offloaded)}L
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.temperature}°C</TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[110px]">{record.fat_percentage}%</TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.protein_percentage}%</TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[130px]">
                {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.destination || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
