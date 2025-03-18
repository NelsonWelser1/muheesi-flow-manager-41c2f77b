
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  FileDown, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  ChevronDown, 
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportActions = ({ filteredRecords }) => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format) => {
    if (!filteredRecords?.length) {
      toast({
        title: "No records to export",
        description: "There are no payment records to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      setExporting(true);
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      const filename = `payments_receipts_${timestamp}`;

      // Prepare data for export
      const exportData = filteredRecords.map(item => ({
        "Payment Type": item.paymentType === 'received' ? 'Payment Received' : 'Payment Issued',
        "Payment Number": item.paymentNumber,
        "Name": item.partyName,
        "Payment Date": item.paymentDate ? format(new Date(item.paymentDate), 'yyyy-MM-dd') : 'N/A',
        "Payment Method": item.paymentMethod?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        "Amount": item.amount,
        "Currency": item.currency,
        "Reference Number": item.referenceNumber || 'N/A',
        "Status": item.status,
        "Notes": item.notes || ''
      }));

      switch (format) {
        case 'csv':
          exportToCSV(exportData, filename);
          break;
        case 'excel':
          exportToExcel(exportData, filename);
          break;
        case 'pdf':
          exportToPDF(exportData, filename);
          break;
        case 'print':
          printData(exportData);
          break;
      }

      toast({
        title: "Export successful",
        description: `Payment records have been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the payment records.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Export to CSV
  const exportToCSV = (data, filename) => {
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(',');
    const csvData = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    const csv = `${headers}\n${csvData}`;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = (data, filename) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Payments & Receipts Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
    
    // Create the table
    autoTable(doc, {
      head: [Object.keys(data[0])],
      body: data.map(item => Object.values(item)),
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 0, 160]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    doc.save(`${filename}.pdf`);
  };

  // Print data
  const printData = (data) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Payments & Receipts Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0000a0; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th { background-color: #0000a0; color: white; text-align: left; padding: 8px; }
            td { border: 1px solid #ddd; padding: 8px; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .report-date { margin-bottom: 20px; color: #666; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; margin: 0; }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print();" style="padding: 10px; background: #0000a0; color: white; border: none; cursor: pointer; margin-bottom: 20px;">
            Print Report
          </button>
          <h1>Payments & Receipts Report</h1>
          <div class="report-date">Generated on: ${format(new Date(), 'MMMM dd, yyyy')}</div>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting} className="flex items-center gap-2">
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileDown className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('print')}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportActions;
