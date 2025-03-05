
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const ProductionTable = ({ productions, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading production records...</div>;
  }

  if (!productions || productions.length === 0) {
    return <div className="text-center py-4">No production records found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Quantity (L)</TableHead>
            <TableHead>Fat Content (%)</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {format(new Date(record.production_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{record.quantity}</TableCell>
              <TableCell>{record.fat_content || 'N/A'}</TableCell>
              <TableCell>{record.notes || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductionTable;
