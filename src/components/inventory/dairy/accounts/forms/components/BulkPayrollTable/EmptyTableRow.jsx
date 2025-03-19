
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

const EmptyTableRow = () => {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        No employee records loaded
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
