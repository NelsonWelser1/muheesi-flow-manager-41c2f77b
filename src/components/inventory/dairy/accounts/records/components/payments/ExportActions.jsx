
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportActions = ({ filteredRecords }) => {
  const exportToCSV = () => {
    const formattedData = formatDataForExport(filteredRecords);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    
    // Generate filename with timestamp
    const filename = `payments_receipts_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    
    // Export to CSV
    XLSX.writeFile(workbook, filename);
  };

  const exportToExcel = () => {
    const formattedData = formatDataForExport(filteredRecords);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    
    // Generate filename with timestamp
    const filename = `payments_receipts_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    
    // Export to Excel
    XLSX.writeFile(workbook, filename);
  };

  const exportToPDF = () => {
    const formattedData = formatDataForExport(filteredRecords);
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Payments & Receipts Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 22);
    
    const tableColumn = ["Number", "Type", "Name", "Date", "Amount", "Method", "Reference", "Status"];
    const tableRows = formattedData.map(item => [
      item.Number,
      item.Type,
      item.Name,
      item.Date,
      item.Amount,
      item.Method,
      item.Reference,
      item.Status
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 160] }
    });
    
    const filename = `payments_receipts_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    doc.save(filename);
  };

  const printData = () => {
    const printContent = formatDataForPrint(filteredRecords);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payments & Receipts Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #0000a0;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .report-header {
              margin-bottom: 20px;
            }
            h1 {
              color: #0000a0;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>Payments & Receipts Report</h1>
            <p>Generated on: ${format(new Date(), 'PPpp')}</p>
          </div>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = function() {
      printWindow.print();
    };
  };

  const formatDataForExport = (data) => {
    return data.map(record => ({
      Number: record.paymentNumber,
      Type: record.paymentType === 'received' ? 'Payment Received' : 'Payment Issued',
      Name: record.partyName,
      Date: format(new Date(record.paymentDate), 'dd/MM/yyyy'),
      Amount: `${record.currency} ${record.amount.toLocaleString()}`,
      Method: record.paymentMethod.replace('_', ' '),
      Reference: record.referenceNumber || '-',
      Status: record.status,
      Notes: record.notes || '-',
      Created: format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')
    }));
  };

  const formatDataForPrint = (data) => {
    let tableContent = `
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Type</th>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Reference</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(record => {
      tableContent += `
        <tr>
          <td>${record.paymentNumber}</td>
          <td>${record.paymentType === 'received' ? 'Payment Received' : 'Payment Issued'}</td>
          <td>${record.partyName}</td>
          <td>${format(new Date(record.paymentDate), 'dd/MM/yyyy')}</td>
          <td>${record.currency} ${record.amount.toLocaleString()}</td>
          <td>${record.paymentMethod.replace('_', ' ')}</td>
          <td>${record.referenceNumber || '-'}</td>
          <td>${record.status}</td>
        </tr>
      `;
    });

    tableContent += `
        </tbody>
      </table>
    `;

    return tableContent;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Export to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" /> Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={printData} className="flex items-center gap-2">
          <Printer className="h-4 w-4" /> Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
