
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from 'date-fns';

const PaymentsReceiptsTable = ({ records, isLoading, tableType }) => {
  // Set up column headers based on the table type
  const getTableHeaders = () => {
    const commonHeaders = [
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Amount', align: 'right' },
      { key: 'method', label: 'Method' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions', align: 'center' },
    ];

    if (tableType === 'all') {
      return [
        { key: 'payment_number', label: 'Payment #' },
        { key: 'type', label: 'Type' },
        { key: 'party_name', label: 'Party Name' },
        ...commonHeaders
      ];
    } else if (tableType === 'received') {
      return [
        { key: 'payment_number', label: 'Receipt #' },
        { key: 'party_name', label: 'Payer Name' },
        ...commonHeaders
      ];
    } else { // issued
      return [
        { key: 'payment_number', label: 'Payment #' },
        { key: 'party_name', label: 'Payee Name' },
        ...commonHeaders
      ];
    }
  };

  const headers = getTableHeaders();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {headers.map(header => (
              <th 
                key={header.key}
                className={`border px-4 py-2 ${header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{record.payment_number}</td>
                {tableType === 'all' && (
                  <td className="border px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      record.payment_type === 'received' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.payment_type === 'received' ? 'Received' : 'Issued'}
                    </span>
                  </td>
                )}
                <td className="border px-4 py-2">{record.party_name}</td>
                <td className="border px-4 py-2">
                  {format(new Date(record.payment_date), 'dd/MM/yyyy')}
                </td>
                <td className="border px-4 py-2 text-right">
                  {record.amount.toLocaleString()} {record.currency}
                </td>
                <td className="border px-4 py-2 capitalize">
                  {record.payment_method.replace('_', ' ')}
                </td>
                <td className="border px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    record.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : record.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="border px-4 py-8 text-center text-gray-500">
                {isLoading 
                  ? 'Loading records...' 
                  : tableType === 'received'
                    ? 'No receipt records found'
                    : tableType === 'issued'
                      ? 'No payment records found'
                      : 'No payment or receipt records found'
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsReceiptsTable;
