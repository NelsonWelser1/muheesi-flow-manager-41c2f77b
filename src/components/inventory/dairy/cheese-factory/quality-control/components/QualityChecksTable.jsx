
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const QualityChecksTable = ({ checks }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto" id="quality-checks-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Batch ID</TableHead>
            <TableHead className="whitespace-nowrap">Temperature</TableHead>
            <TableHead className="whitespace-nowrap">pH Level</TableHead>
            <TableHead className="whitespace-nowrap">Moisture %</TableHead>
            <TableHead className="whitespace-nowrap">Fat %</TableHead>
            <TableHead className="whitespace-nowrap">Protein %</TableHead>
            <TableHead className="whitespace-nowrap">Salt %</TableHead>
            <TableHead className="whitespace-nowrap">Overall Status</TableHead>
            <TableHead className="whitespace-nowrap">Checked By</TableHead>
            <TableHead className="whitespace-nowrap">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.map((check) => {
            const overallStatus = [
              check.temperature_status,
              check.ph_level_status,
              check.moisture_content_status,
              check.fat_content_status,
              check.protein_content_status,
              check.salt_content_status
            ].includes('failed') ? 'failed' : 'passed';

            return (
              <TableRow key={check.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(check.created_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {check.batch_id}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.temperature_value}</span>
                    <Badge className={getStatusBadgeColor(check.temperature_status)}>
                      {check.temperature_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.ph_level_value}</span>
                    <Badge className={getStatusBadgeColor(check.ph_level_status)}>
                      {check.ph_level_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.moisture_content_value}</span>
                    <Badge className={getStatusBadgeColor(check.moisture_content_status)}>
                      {check.moisture_content_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.fat_content_value}</span>
                    <Badge className={getStatusBadgeColor(check.fat_content_status)}>
                      {check.fat_content_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.protein_content_value}</span>
                    <Badge className={getStatusBadgeColor(check.protein_content_status)}>
                      {check.protein_content_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{check.salt_content_value}</span>
                    <Badge className={getStatusBadgeColor(check.salt_content_status)}>
                      {check.salt_content_status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={getStatusBadgeColor(overallStatus)}>
                    {overallStatus}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {check.checked_by || '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                  {check.notes || '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default QualityChecksTable;
