
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

  // Format value for display based on the type
  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    
    // Check if value is a date string
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      try {
        return new Date(value).toLocaleString();
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };

  // Format header for display
  const formatHeader = (header) => {
    return header.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(data[0]).map((header) => (
              <TableHead key={header}>
                {formatHeader(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              {Object.values(record).map((value, i) => (
                <TableCell key={i}>
                  {formatValue(value)}
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
