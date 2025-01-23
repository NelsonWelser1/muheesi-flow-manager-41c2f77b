import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const SearchBar = ({ searchTerm, setSearchTerm, items }) => {
  console.log('Rendering SearchBar with items:', items);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    const tableData = items.map(item => [
      item.item_name,
      item.section,
      item.quantity,
      item.unit_cost,
      item.total_cost,
      item.status
    ]);

    doc.autoTable({
      head: [['Item Name', 'Section', 'Quantity', 'Unit Cost', 'Total Cost', 'Status']],
      body: tableData,
    });

    doc.save('inventory-list.pdf');
  };

  const downloadCSV = () => {
    const headers = ['Item Name', 'Section', 'Quantity', 'Unit Cost', 'Total Cost', 'Status'];
    const csvData = items.map(item => 
      [
        item.item_name,
        item.section,
        item.quantity,
        item.unit_cost,
        item.total_cost,
        item.status
      ].join(',')
    );
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory-list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJPG = async () => {
    const table = document.querySelector('.inventory-table');
    if (table) {
      const canvas = await html2canvas(table);
      const link = document.createElement('a');
      link.download = 'inventory-list.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
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