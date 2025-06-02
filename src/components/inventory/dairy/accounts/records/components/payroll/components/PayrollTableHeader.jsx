
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PayrollTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap">Payslip Number</TableHead>
        <TableHead className="whitespace-nowrap">Employee Name</TableHead>
        <TableHead className="whitespace-nowrap">Employee ID</TableHead>
        <TableHead className="whitespace-nowrap">Department</TableHead>
        <TableHead className="whitespace-nowrap">Payment Date</TableHead>
        <TableHead className="whitespace-nowrap">Basic Salary</TableHead>
        <TableHead className="whitespace-nowrap">Net Salary</TableHead>
        <TableHead className="whitespace-nowrap">Status</TableHead>
        <TableHead className="whitespace-nowrap">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PayrollTableHeader;
