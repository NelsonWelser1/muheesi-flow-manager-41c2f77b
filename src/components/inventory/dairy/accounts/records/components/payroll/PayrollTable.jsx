
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { useCurrencyFormatter } from "./hooks/useCurrencyFormatter";
import PayrollTableHeader from './components/PayrollTableHeader';
import PayrollTableRow from './components/PayrollTableRow';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';

const PayrollTable = ({ records, loading }) => {
  const { formatCurrency } = useCurrencyFormatter();

  if (loading) {
    return <LoadingState />;
  }

  if (records.length === 0) {
    return <EmptyState message="No payroll records found." />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <PayrollTableHeader />
        <TableBody>
          {records.map(record => (
            <PayrollTableRow 
              key={record.id} 
              record={record} 
              formatCurrency={formatCurrency} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;
