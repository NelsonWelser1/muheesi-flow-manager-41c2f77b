
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import PayslipStatusBadge from './PayslipStatusBadge';
import PayslipActionButtons from './payslip-actions/PayslipActionButtons';

const PayrollTableRow = ({ record, formatCurrency }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap font-medium">{record.payslip_number}</TableCell>
      <TableCell className="whitespace-nowrap">{record.employee_name}</TableCell>
      <TableCell className="whitespace-nowrap">{record.employee_id}</TableCell>
      <TableCell className="whitespace-nowrap">{record.department}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(record.payment_date)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(record.basic_salary, record.currency)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(record.net_salary, record.currency)}</TableCell>
      <TableCell className="whitespace-nowrap">
        <PayslipStatusBadge status={record.payment_status} />
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <PayslipActionButtons record={record} />
      </TableCell>
    </TableRow>
  );
};

export default PayrollTableRow;
