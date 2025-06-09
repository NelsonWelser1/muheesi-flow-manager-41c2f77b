import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
const ExportActions = ({
  data,
  title
}) => {
  const {
    toast
  } = useToast();

  // Export to CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }
    try {
      // Get all keys from the first object
      const keys = Object.keys(data[0]);

      // Convert snake_case to Title Case for headers (exclude items/arrays)
      const headers = keys.filter(key => !['items', 'delivered_items', 'deliveredItems'].includes(key)).map(key => key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

      // Convert data to rows
      const rows = data.map(item => keys.filter(key => !['items', 'delivered_items', 'deliveredItems'].includes(key)).map(key => {
        // Format dates
        if (key.includes('date') && item[key]) {
          return new Date(item[key]).toLocaleDateString();
        }
        return item[key];
      }));

      // Create CSV content
      const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => typeof cell === 'object' ? JSON.stringify(cell) : cell).join(','))].join('\n');

      // Create and download blob
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Export Successful",
        description: "Data exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to CSV",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }
    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();

      // Process data to handle nested objects
      const processedData = data.map(item => {
        const processed = {};
        Object.keys(item).forEach(key => {
          // Skip items arrays for Excel
          if (['items', 'delivered_items', 'deliveredItems'].includes(key)) {
            return;
          }
          if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
            Object.keys(item[key]).forEach(nestedKey => {
              processed[`${key}_${nestedKey}`] = item[key][nestedKey];
            });
          } else if (Array.isArray(item[key])) {
            processed[key] = JSON.stringify(item[key]);
          } else {
            // Format dates
            if (key.includes('date') && item[key]) {
              processed[key] = new Date(item[key]).toLocaleDateString();
            } else {
              processed[key] = item[key];
            }
          }
        });
        return processed;
      });
      const worksheet = XLSX.utils.json_to_sheet(processedData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, title);

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast({
        title: "Export Successful",
        description: "Data exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to Excel",
        variant: "destructive"
      });
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export",
        variant: "destructive"
      });
      return;
    }
    try {
      const doc = new jsPDF();

      // Set title
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Get relevant keys from data (exclude some system fields)
      const excludedKeys = ['items', 'delivered_items', 'deliveredItems', 'created_at', 'updated_at'];
      const firstItem = data[0];
      const keys = Object.keys(firstItem).filter(key => !excludedKeys.includes(key)).slice(0, 6); // Limit columns to 6 for better readability

      // Convert data for table
      const tableData = data.map(item => {
        const rowData = [];
        keys.forEach(key => {
          if (key.includes('date') && item[key]) {
            rowData.push(new Date(item[key]).toLocaleDateString());
          } else if (typeof item[key] === 'object' && item[key] !== null) {
            rowData.push(JSON.stringify(item[key]).substring(0, 30) + '...');
          } else {
            rowData.push(item[key]);
          }
        });
        return rowData;
      });

      // Generate readable headers from keys (convert snake_case to Title Case)
      const headers = keys.map(key => key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

      // Add table
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 40,
        margin: {
          top: 15
        },
        styles: {
          overflow: 'linebreak'
        },
        columnStyles: {
          0: {
            cellWidth: 25
          }
        },
        headStyles: {
          fillColor: [41, 128, 185]
        }
      });

      // Save PDF
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast({
        title: "Export Successful",
        description: "Data exported to PDF successfully"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Could not export data to PDF",
        variant: "destructive"
      });
    }
  };
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>;
};
export default ExportActions;