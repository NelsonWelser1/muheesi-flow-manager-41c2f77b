
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from 'date-fns';
import PayslipStatusBadge from './PayslipStatusBadge';
import PayslipActionButtons from './payslip-actions';

const PayrollTableRow = ({ record, formatCurrency }) => {
  // Calculate total deductions
  const totalDeductions = 
    parseFloat(record.tax_amount || 0) + 
    parseFloat(record.nssf_amount || 0) + 
    parseFloat(record.loan_deduction || 0) + 
    parseFloat(record.other_deductions || 0);
  
  return (
    <TableRow key={record.id}>
      <TableCell className="font-medium">{record.payslip_number}</TableCell>
      <TableCell>
        <div className="font-medium">{record.employee_name}</div>
        <div className="text-xs text-gray-500">ID: {record.employee_id}</div>
      </TableCell>
      <TableCell>{format(new Date(record.payment_date), 'dd MMM yyyy')}</TableCell>
      <TableCell>{record.department || 'N/A'}</TableCell>
      <TableCell>{formatCurrency(record.basic_salary, record.currency)}</TableCell>
      <TableCell>{formatCurrency(totalDeductions, record.currency)}</TableCell>
      <TableCell className="font-medium">{formatCurrency(record.net_salary, record.currency)}</TableCell>
      <TableCell>
        <PayslipStatusBadge status={record.payment_status} />
      </TableCell>
      <TableCell>
        <PayslipActionButtons record={record} formatCurrency={formatCurrency} />
      </TableCell>
    </TableRow>
  );
};

export default PayrollTableRow;
