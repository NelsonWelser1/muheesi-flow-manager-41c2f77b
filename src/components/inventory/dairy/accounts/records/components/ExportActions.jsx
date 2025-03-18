
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud, 
  FileSpreadsheet, 
  FilePdf 
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const ExportActions = ({ filteredRecords }) => {
  const { toast } = useToast();
  
  // Export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Convert the data to the format needed for Excel
    const data = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Type': record.payment_type === 'received' ? 'Received' : 'Issued',
      'Party Name': record.party_name,
      'Date': format(new Date(record.payment_date), 'dd/MM/yyyy'),
      'Amount': record.amount,
      'Currency': record.currency,
      'Method': record.payment_method,
      'Reference': record.reference_number || '',
      'Status': record.status,
      'Notes': record.notes || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments_Receipts');
    XLSX.writeFile(workbook, 'Payments_Receipts_Report.xlsx');
    
    toast({
      title: "Excel Export",
      description: "Data exported successfully to Excel",
    });
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Type': record.payment_type === 'received' ? 'Received' : 'Issued',
      'Party Name': record.party_name,
      'Date': format(new Date(record.payment_date), 'dd/MM/yyyy'),
      'Amount': record.amount,
      'Currency': record.currency,
      'Method': record.payment_method,
      'Reference': record.reference_number || '',
      'Status': record.status,
      'Notes': record.notes || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create a blob and download
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'Payments_Receipts_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Export",
      description: "Data exported successfully to CSV",
    });
  };
  
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add a title
    doc.setFontSize(18);
    doc.text('Payments & Receipts Report', 14, 22);
    
    // Add a subtitle with the current date
    doc.setFontSize(11);
    doc.text(`Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
    
    // Create the table
    const tableColumn = [
      'Payment #', 
      'Type', 
      'Party', 
      'Date', 
      'Amount', 
      'Method', 
      'Status'
    ];
    
    const tableRows = filteredRecords.map(record => [
      record.payment_number,
      record.payment_type === 'received' ? 'Received' : 'Issued',
      record.party_name,
      format(new Date(record.payment_date), 'dd/MM/yyyy'),
      `${record.amount} ${record.currency}`,
      record.payment_method,
      record.status
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [0, 0, 160] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    });
    
    doc.save('Payments_Receipts_Report.pdf');
    
    toast({
      title: "PDF Export",
      description: "Data exported successfully to PDF",
    });
  };
  
  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <DownloadCloud className="h-4 w-4" />
        Export
      </Button>
      <div className="absolute right-0 mt-2 w-40 hidden group-hover:block z-10">
        <div className="bg-white shadow-md rounded-md overflow-hidden border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start px-3 py-2 flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start px-3 py-2 flex items-center gap-2"
            onClick={exportToCSV}
          >
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start px-3 py-2 flex items-center gap-2"
            onClick={exportToPDF}
          >
            <FilePdf className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportActions;
