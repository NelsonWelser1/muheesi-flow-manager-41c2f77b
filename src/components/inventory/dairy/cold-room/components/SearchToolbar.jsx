
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Download, Printer, RefreshCw, Search, Calendar as CalendarIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SearchToolbar = ({ 
  onSearch, 
  onRefresh, 
  onDateRangeChange,
  data,
  columns,
  tableTitle,
  loading 
}) => {
  const [dateRange, setDateRange] = React.useState({ from: null, to: null });

  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  const handleDateRangeSelect = (type, direction) => {
    const today = new Date();
    let from = new Date();
    
    switch(type) {
      case 'day':
        from.setDate(today.getDate() + (direction === 'add' ? 1 : -1));
        break;
      case 'week':
        from.setDate(today.getDate() + (direction === 'add' ? 7 : -7));
        break;
      case 'month':
        from.setMonth(today.getMonth() + (direction === 'add' ? 1 : -1));
        break;
      case 'year':
        from.setFullYear(today.getFullYear() + (direction === 'add' ? 1 : -1));
        break;
    }

    const newRange = {
      from: direction === 'add' ? today : from,
      to: direction === 'add' ? from : today
    };
    setDateRange(newRange);
    onDateRangeChange(newRange);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${tableTitle.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.accessorKey])),
      styles: { overflow: 'linebreak', cellWidth: 'auto' },
      columnStyles: { text: { cellWidth: 'auto' } }
    });
    doc.save(`${tableTitle.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => 
      columns.map(col => `"${row[col.accessorKey]}"`).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableTitle.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print:hidden">
      <div className="flex-1 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search all fields..."
            onChange={handleSearch}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateRange.from ? (
                <>
                  {format(dateRange.from, 'PPP')} - {dateRange.to ? format(dateRange.to, 'PPP') : 'Select'}
                </>
              ) : (
                "Date Range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                {['day', 'week', 'month', 'year'].map((type) => (
                  <div key={type} className="flex gap-1">
                    <Button size="sm" onClick={() => handleDateRangeSelect(type, 'remove')}>
                      -{type.charAt(0)}
                    </Button>
                    <Button size="sm" onClick={() => handleDateRangeSelect(type, 'add')}>
                      +{type.charAt(0)}
                    </Button>
                  </div>
                ))}
              </div>
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange(range || { from: null, to: null });
                  onDateRangeChange(range || { from: null, to: null });
                }}
              />
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToExcel}>
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>
              Export to PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToCSV}>
              Export to CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={loading}
          className={loading ? 'animate-spin' : ''}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
