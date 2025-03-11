
import React from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const DataTable = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!data?.length) {
    return <div className="text-center py-4">No records found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(data[0]).map((header) => (
              <TableHead key={header}>
                {header.replace(/_/g, ' ').toUpperCase()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              {Object.values(record).map((value, i) => (
                <TableCell key={i}>
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
