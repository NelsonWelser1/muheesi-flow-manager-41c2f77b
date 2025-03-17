
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, Mail, Download } from "lucide-react";
import { format } from 'date-fns';

const PaymentsReceiptsTable = ({ filteredRecords }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount, currency = 'UGX') => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleGenerateReceipt = (record) => {
    console.log("Generating receipt for:", record);
    // Implement receipt generation logic
  };

  const handleEmailReceipt = (record) => {
    console.log("Emailing receipt for:", record);
    // Implement email receipt logic
  };

  const handleDownloadPdf = (record) => {
    console.log("Downloading PDF for:", record);
    // Implement PDF download logic
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Number</TableHead>
            <TableHead>{filteredRecords[0]?.paymentType === 'received' ? 'Payer' : 'Payee'}</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.paymentNumber}</TableCell>
              <TableCell>{record.partyName}</TableCell>
              <TableCell>{formatDate(record.paymentDate)}</TableCell>
              <TableCell>{record.paymentType === 'received' ? 'Receipt' : 'Payment'}</TableCell>
              <TableCell className="capitalize">{record.paymentMethod?.replace('_', ' ')}</TableCell>
              <TableCell>{formatCurrency(record.amount, record.currency)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(record.status)}`}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleGenerateReceipt(record)}
                    title="Generate Receipt"
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEmailReceipt(record)}
                    title="Email Receipt"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadPdf(record)}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsReceiptsTable;
