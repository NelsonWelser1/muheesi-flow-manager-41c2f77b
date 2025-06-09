
import React from 'react';
import { Printer, Eye } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ExportButton from './ExportButton';

const PrintOptions = ({ data, onSuccess, onError }) => {
  const handlePrintPreview = () => {
    if (!data || data.length === 0) {
      onError('No data available to print');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      const printContent = generatePrintContent(data);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      onSuccess('Print preview opened successfully');
    } catch (error) {
      onError(`Failed to open print preview: ${error.message}`);
    }
  };

  const handleDirectPrint = () => {
    if (!data || data.length === 0) {
      onError('No data available to print');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      const printContent = generatePrintContent(data);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      onSuccess('Document sent to printer successfully');
    } catch (error) {
      onError(`Failed to print: ${error.message}`);
    }
  };

  const generatePrintContent = (data) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = data.map(item => 
      `<tr>${headers.map(h => `<td>${item[h] || ''}</td>`).join('')}</tr>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Export Data</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; }
            .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Export Data</h1>
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
        </body>
      </html>
    `;
  };

  return (
    <>
      <DropdownMenuSeparator />
      <ExportButton
        icon={Eye}
        label="Print Preview"
        onClick={handlePrintPreview}
      />
      <ExportButton
        icon={Printer}
        label="Direct Print"
        onClick={handleDirectPrint}
      />
    </>
  );
};

export default PrintOptions;
