import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter,
  CalendarIcon 
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths, subYears, subHours } from 'date-fns';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const MilkReceptionTable = ({ records = [], isLoading = false, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportDateRange, setExportDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState();
  const [customEndDate, setCustomEndDate] = useState();
  const { toast } = useToast();

  const filteredRecords = records
    ? [...records]
        .filter(record => {
          const term = searchTerm.toLowerCase();
          return (
            record.supplier_name?.toLowerCase().includes(term) ||
            record.batch_number?.toLowerCase().includes(term) ||
            record.tank_number?.toLowerCase().includes(term)
          );
        })
        .filter(record => filterStatus === 'all' || record.status === filterStatus)
        .sort((a, b) => {
          const dateA = new Date(a.reception_date || a.created_at);
          const dateB = new Date(b.reception_date || b.created_at);

          if (sortBy === 'supplier') {
            const supplierA = a.supplier_name || '';
            const supplierB = b.supplier_name || '';
            return sortOrder === 'asc' ? supplierA.localeCompare(supplierB) : supplierB.localeCompare(supplierA);
          } else {
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          }
        })
    : [];

  const getDateRangeFilter = () => {
    const now = new Date();
    
    switch (exportDateRange) {
      case 'hour':
        return { start: subHours(now, 1), end: now };
      case 'day':
        return { start: subDays(now, 1), end: now };
      case 'week':
        return { start: subWeeks(now, 1), end: now };
      case 'month':
        return { start: subMonths(now, 1), end: now };
      case 'year':
        return { start: subYears(now, 1), end: now };
      case 'custom':
        return { start: customStartDate, end: customEndDate };
      default:
        return null;
    }
  };

  const getFilteredRecordsForExport = () => {
    let filtered = [...records];
    
    // Apply date range filter
    const dateRange = getDateRangeFilter();
    if (dateRange && dateRange.start && dateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.reception_date || record.created_at);
        return recordDate >= dateRange.start && recordDate <= dateRange.end;
      });
    }
    
    // Apply search and status filters
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.supplier_name?.toLowerCase().includes(term) ||
        record.batch_number?.toLowerCase().includes(term) ||
        record.tank_number?.toLowerCase().includes(term)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status === filterStatus);
    }
    
    return filtered;
  };

  const exportToCSV = () => {
    const filteredData = getFilteredRecordsForExport();
    
    if (filteredData.length === 0) {
      toast({
        title: "No data to export",
        description: "No records found for the selected date range",
        variant: "destructive"
      });
      return;
    }

    try {
      const headers = ['Date', 'Supplier', 'Batch Number', 'Tank Number', 'Quantity (L)', 'Fat %', 'Protein %', 'Temperature', 'pH Level', 'Status'];
      
      const csvContent = [
        headers.join(','),
        ...filteredData.map(record => [
          format(new Date(record.reception_date || record.created_at), 'yyyy-MM-dd HH:mm'),
          record.supplier_name || '',
          record.batch_number || '',
          record.tank_number || '',
          record.quantity || 0,
          record.fat_percentage || 0,
          record.protein_percentage || 0,
          record.temperature || 0,
          record.ph_level || 0,
          record.status || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `milk-reception-${exportDateRange}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${filteredData.length} records exported to CSV`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data to CSV",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    const filteredData = getFilteredRecordsForExport();
    
    if (filteredData.length === 0) {
      toast({
        title: "No data to export",
        description: "No records found for the selected date range",
        variant: "destructive"
      });
      return;
    }

    try {
      const processedData = filteredData.map(record => ({
        'Date': format(new Date(record.reception_date || record.created_at), 'yyyy-MM-dd HH:mm'),
        'Supplier': record.supplier_name || '',
        'Batch Number': record.batch_number || '',
        'Tank Number': record.tank_number || '',
        'Quantity (L)': record.quantity || 0,
        'Fat %': record.fat_percentage || 0,
        'Protein %': record.protein_percentage || 0,
        'Temperature': record.temperature || 0,
        'pH Level': record.ph_level || 0,
        'Status': record.status || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(processedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Reception');
      
      XLSX.writeFile(workbook, `milk-reception-${exportDateRange}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

      toast({
        title: "Export Successful",
        description: `${filteredData.length} records exported to Excel`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data to Excel",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = () => {
    const filteredData = getFilteredRecordsForExport();
    
    if (filteredData.length === 0) {
      toast({
        title: "No data to export",
        description: "No records found for the selected date range",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Milk Reception Records', 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
      doc.text(`Date Range: ${exportDateRange}`, 14, 38);
      doc.text(`Total Records: ${filteredData.length}`, 14, 46);

      const tableData = filteredData.map(record => [
        format(new Date(record.reception_date || record.created_at), 'MM/dd/yyyy'),
        record.supplier_name || '',
        record.batch_number || '',
        record.quantity || 0,
        record.fat_percentage || 0,
        record.status || ''
      ]);

      doc.autoTable({
        head: [['Date', 'Supplier', 'Batch', 'Quantity (L)', 'Fat %', 'Status']],
        body: tableData,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 85, 119] }
      });

      doc.save(`milk-reception-${exportDateRange}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      toast({
        title: "Export Successful",
        description: `${filteredData.length} records exported to PDF`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data to PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by supplier, batch, or tank number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
          <h3 className="font-medium">Export Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={exportDateRange} onValueChange={setExportDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportDateRange === 'custom' && (
              <div className="space-y-2">
                <label className="text-sm font-medium block">Custom Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="text-sm text-muted-foreground">
              {getFilteredRecordsForExport().length} records will be exported
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>Tank Number</TableHead>
              <TableHead>Quantity (L)</TableHead>
              <TableHead>Fat %</TableHead>
              <TableHead>Protein %</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>pH Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.reception_date || record.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>{record.supplier_name}</TableCell>
                  <TableCell>{record.batch_number}</TableCell>
                  <TableCell>{record.tank_number}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.fat_percentage}</TableCell>
                  <TableCell>{record.protein_percentage}</TableCell>
                  <TableCell>{record.temperature}</TableCell>
                  <TableCell>{record.ph_level}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'accepted' ? 'success' : record.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MilkReceptionTable;
