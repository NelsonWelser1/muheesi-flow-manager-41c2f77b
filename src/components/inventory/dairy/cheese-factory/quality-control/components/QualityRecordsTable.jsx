
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const QualityRecordsTable = ({ checks }) => {
  const renderStatusBadge = (status) => (
    <Badge variant={status === 'Passed' ? 'success' : 'destructive'}>
      {status}
    </Badge>
  );

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Batch ID</TableHead>
            <TableHead>Parameter</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Standard</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.flatMap((check) => [
            {
              ...check,
              parameter: 'Temperature',
              actual: check.temperature_actual,
              standard: check.temperature_standard,
              status: check.temperature_status
            },
            {
              ...check,
              parameter: 'pH Level',
              actual: check.ph_level_actual,
              standard: check.ph_level_standard,
              status: check.ph_level_status
            },
            {
              ...check,
              parameter: 'Moisture',
              actual: check.moisture_actual,
              standard: check.moisture_standard,
              status: check.moisture_status
            },
            {
              ...check,
              parameter: 'Fat',
              actual: check.fat_actual,
              standard: check.fat_standard,
              status: check.fat_status
            },
            {
              ...check,
              parameter: 'Protein',
              actual: check.protein_actual,
              standard: check.protein_standard,
              status: check.protein_status
            },
            {
              ...check,
              parameter: 'Salt',
              actual: check.salt_actual,
              standard: check.salt_standard,
              status: check.salt_status
            }
          ]).map((row, index) => (
            <TableRow key={`${row.id}-${row.parameter}`}>
              {index % 6 === 0 && (
                <TableCell rowSpan={6} className="align-top">
                  {format(new Date(row.created_at), 'PPp')}
                </TableCell>
              )}
              {index % 6 === 0 && (
                <TableCell rowSpan={6} className="align-top font-medium">
                  {row.batch_id}
                </TableCell>
              )}
              <TableCell>{row.parameter}</TableCell>
              <TableCell>{row.actual}</TableCell>
              <TableCell>{row.standard}</TableCell>
              <TableCell>{renderStatusBadge(row.status)}</TableCell>
              {index % 6 === 0 && (
                <TableCell rowSpan={6} className="align-top">
                  {row.notes}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QualityRecordsTable;
