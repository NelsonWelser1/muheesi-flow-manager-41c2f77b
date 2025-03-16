
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportActions = ({ filteredRecords }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Bill Number': record.bill_number,
        'Supplier': record.supplier_name,
        'Date': record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        'Due Date': record.due_date ? format(new Date(record.due_date), 'yyyy-MM-dd') : '',
        'Expense Type': record.expense_type,
        'Details': record.expense_details,
        'Amount': record.amount,
        'Currency': record.currency,
        'Payment Method': record.payment_method,
        'Status': record.status,
        'Recurring': record.is_recurring ? 'Yes' : 'No',
        'Notes': record.notes
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills & Expenses');
    XLSX.writeFile(workbook, 'bills-expenses.xlsx');
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Bill Number': record.bill_number,
        'Supplier': record.supplier_name,
        'Date': record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        'Due Date': record.due_date ? format(new Date(record.due_date), 'yyyy-MM-dd') : '',
        'Expense Type': record.expense_type,
        'Details': record.expense_details,
        'Amount': record.amount,
        'Currency': record.currency,
        'Payment Method': record.payment_method,
        'Status': record.status,
        'Recurring': record.is_recurring ? 'Yes' : 'No',
        'Notes': record.notes
      }))
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bills-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Bills & Expenses Report', 14, 16);
    
    doc.autoTable({
      head: [['Bill Number', 'Supplier', 'Date', 'Amount', 'Status']],
      body: filteredRecords.map(record => [
        record.bill_number,
        record.supplier_name,
        record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        `${record.currency} ${record.amount}`,
        record.status
      ]),
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 0, 160],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    doc.save('bills-expenses.pdf');
  };
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-1"
        title="Export to Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        className="flex items-center gap-1"
        title="Export to CSV"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-1"
        title="Export to PDF"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default ExportActions;
