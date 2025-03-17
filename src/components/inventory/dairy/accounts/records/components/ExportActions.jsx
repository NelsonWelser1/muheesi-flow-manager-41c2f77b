
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileSpreadsheet, 
  FileText 
} from "lucide-react";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportActions = ({ filteredRecords }) => {
  const exportToExcel = () => {
    const formattedData = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Date': new Date(record.payment_date).toLocaleDateString(),
      'Type': record.payment_type === 'received' ? 'Receipt' : 'Payment',
      'Party': record.party_name,
      'Amount': `${record.currency} ${record.amount}`,
      'Method': record.payment_method,
      'Status': record.status,
      'Reference': record.reference_number || 'N/A',
      'Notes': record.notes || 'N/A'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    
    // Generate file name with current date
    const fileName = `payments_receipts_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Trigger download
    XLSX.writeFile(workbook, fileName);
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Payments & Receipts Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableColumn = ["Payment #", "Date", "Type", "Party", "Amount", "Status"];
    const tableRows = filteredRecords.map(record => [
      record.payment_number,
      new Date(record.payment_date).toLocaleDateString(),
      record.payment_type === 'received' ? 'Receipt' : 'Payment',
      record.party_name,
      `${record.currency} ${record.amount}`,
      record.status
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 0, 160] }
    });
    
    // Generate file name with current date
    const fileName = `payments_receipts_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save PDF
    doc.save(fileName);
  };
  
  const exportToCSV = () => {
    const formattedData = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Date': new Date(record.payment_date).toLocaleDateString(),
      'Type': record.payment_type === 'received' ? 'Receipt' : 'Payment',
      'Party': record.party_name,
      'Amount': `${record.currency} ${record.amount}`,
      'Method': record.payment_method,
      'Status': record.status,
      'Reference': record.reference_number || 'N/A',
      'Notes': record.notes || 'N/A'
    }));
    
    // Convert to CSV
    const headers = Object.keys(formattedData[0] || {}).join(',');
    const csv = [
      headers,
      ...formattedData.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_receipts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={exportToExcel} 
        className="flex items-center gap-1"
        disabled={filteredRecords.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Excel</span>
      </Button>
      <Button 
        variant="outline" 
        onClick={exportToPDF} 
        className="flex items-center gap-1"
        disabled={filteredRecords.length === 0}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button 
        variant="outline" 
        onClick={exportToCSV} 
        className="flex items-center gap-1"
        disabled={filteredRecords.length === 0}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">CSV</span>
      </Button>
    </div>
  );
};

export default ExportActions;
