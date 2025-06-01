
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const SearchBar = ({ searchTerm, setSearchTerm, items }) => {
  console.log('Rendering SearchBar with items:', items);

  const downloadPDF = () => {
    if (!items || items.length === 0) {
      console.error('No items to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Inventory Items Report', 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      
      const tableData = items.map(item => [
        item.item_name || '',
        item.section || '',
        item.quantity || 0,
        `UGX ${Number(item.unit_cost || 0).toLocaleString()}`,
        `UGX ${Number(item.total_cost || 0).toLocaleString()}`,
        item.supplier_details || 'N/A',
        item.notes || 'N/A',
        item.status || ''
      ]);

      doc.autoTable({
        head: [['Item Name', 'Section', 'Quantity', 'Unit Cost', 'Total Cost', 'Supplier Details', 'Notes', 'Status']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        columnStyles: {
          5: { cellWidth: 30 },
          6: { cellWidth: 30 }
        }
      });

      doc.save('inventory-list.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadCSV = () => {
    if (!items || items.length === 0) {
      console.error('No items to export');
      return;
    }

    try {
      const headers = ['Item Name', 'Section', 'Quantity', 'Unit Cost', 'Total Cost', 'Supplier Details', 'Notes', 'Status'];
      const csvData = items.map(item => 
        [
          item.item_name || '',
          item.section || '',
          item.quantity || 0,
          item.unit_cost || 0,
          item.total_cost || 0,
          item.supplier_details || 'N/A',
          item.notes || 'N/A',
          item.status || ''
        ].map(field => `"${String(field).replace(/"/g, '""')}"`)
      );
      
      const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'inventory-list.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  const downloadJPG = async () => {
    try {
      const table = document.querySelector('.inventory-table');
      if (table) {
        const canvas = await html2canvas(table, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = 'inventory-list.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.92);
        link.click();
      } else {
        console.error('Table element not found');
      }
    } catch (error) {
      console.error('Error generating JPG:', error);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-2 w-full">
      <div className="flex items-center space-x-2 flex-1">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadPDF}>
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadCSV}>
            Download CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadJPG}>
            Download JPG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchBar;
