
import React from 'react';
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const PayrollTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Payslip #</TableHead>
        <TableHead>Employee</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Department</TableHead>
        <TableHead>Basic Salary</TableHead>
        <TableHead>Deductions</TableHead>
        <TableHead>Net Salary</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PayrollTableHeader;
