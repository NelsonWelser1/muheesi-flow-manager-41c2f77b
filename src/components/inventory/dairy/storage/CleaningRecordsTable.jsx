import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CleaningRecordsTable = ({ records = [] }) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tank</TableHead>
            <TableHead>Cleaned At</TableHead>
            <TableHead>Cleaner ID</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.tank_name}</TableCell>
              <TableCell>{format(new Date(record.cleaned_at), 'PPp')}</TableCell>
              <TableCell>{record.cleaner_id}</TableCell>
              <TableCell>{record.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CleaningRecordsTable;