
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, Search, Download, FileSpreadsheet, FileText, Printer, Eye, EyeOff } from "lucide-react";
import { format } from 'date-fns';
import { useMilkReception } from '@/hooks/useMilkReception';
import { useToast } from "@/components/ui/use-toast";

const RecentOffloadRecords = () => {
  const { data: records, isLoading, error, refetch } = useMilkReception();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Filter records to only show offloads (negative volumes) and ensure batch_id exists
  const offloadRecords = useMemo(() => {
    if (!records) return [];
    
    return records
      .filter(record => record.milk_volume < 0)
      .map(record => ({
        ...record,
        // Ensure every record has a batch_id - generate one if missing
        batch_id: record.batch_id || `LEGACY-${record.id || Date.now()}-${Math.random().toString(36).substr(2, 6)}`
      }));
  }, [records]);

  // Apply filters and sorting
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = [...offloadRecords];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.supplier_name?.toLowerCase().includes(search) ||
        record.tank_number?.toLowerCase().includes(search) ||
        record.batch_id?.toLowerCase().includes(search) ||
        record.quality_score?.toLowerCase().includes(search)
      );
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (timeFilter) {
        case 'hour':
          startDate.setHours(now.getHours() - 1);
          break;
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(record => {
        const createdDate = new Date(record.created_at);
        return createdDate >= startDate;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aVal === null || aVal === undefined) aVal = '';
        if (bVal === null || bVal === undefined) bVal = '';
        
        // Handle date sorting
        if (sortConfig.key.includes('time') || sortConfig.key === 'created_at') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle string sorting
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        // Handle number sorting
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return filtered;
  }, [offloadRecords, searchTerm, timeFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (recordId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const getQualityBadge = (quality) => {
    if (!quality) return <Badge variant="outline">Unknown</Badge>;
    
    switch (quality) {
      case 'Grade A':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Grade A</Badge>;
      case 'Grade B':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Grade B</Badge>;
      case 'Grade C':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Grade C</Badge>;
      default:
        return <Badge variant="outline">{quality}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatBatchId = (batchId) => {
    if (!batchId) return 'No Batch ID';
    return batchId;
  };

  const exportToCSV = () => {
    if (filteredAndSortedRecords.length === 0) {
      toast({
        title: "No Data",
        description: "No records to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Date', 'Batch ID', 'Tank', 'Volume (L)', 'Temperature (°C)', 
      'Quality', 'Fat %', 'Protein %', 'pH', 'Total Plate Count', 'Acidity', 
      'Destination', 'Notes'
    ];
    
    const csvData = filteredAndSortedRecords.map(record => [
      formatDate(record.created_at),
      formatBatchId(record.batch_id),
      record.tank_number || 'N/A',
      Math.abs(record.milk_volume || 0),
      record.temperature || 'N/A',
      record.quality_score || 'N/A',
      record.fat_percentage || 'N/A',
      record.protein_percentage || 'N/A',
      record.acidity || 'N/A', // pH is stored in acidity field
      record.total_plate_count || 'N/A',
      record.acidity || 'N/A',
      record.destination || 'N/A',
      record.notes || 'N/A'
    ]);

    const csvContent = [headers, ...csvData].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milk_offload_records_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "CSV file has been downloaded"
    });
  };

  const exportToExcel = () => {
    // Similar to CSV but would use a library like xlsx for Excel format
    exportToCSV(); // For now, using CSV export
  };

  const handlePrint = () => {
    const printContent = document.getElementById('offload-records-table');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Milk Offload Records</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; margin-bottom: 20px; }
              .header { margin-bottom: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Milk Offload Records</h1>
              <p>Generated on: ${format(new Date(), 'PPP')}</p>
              <p>Total Records: ${filteredAndSortedRecords.length}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading offload records...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading records: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Milk Offload Records</CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch ID, tank, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
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
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Records
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredAndSortedRecords.length} offload records
        </div>
        
        {filteredAndSortedRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {searchTerm ? 'No records found matching your search.' : 'No milk offload records found.'}
          </div>
        ) : (
          <div className="overflow-x-auto" id="offload-records-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('created_at')}
                  >
                    Date {renderSortIcon('created_at')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('batch_id')}
                  >
                    Batch ID {renderSortIcon('batch_id')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('tank_number')}
                  >
                    Tank {renderSortIcon('tank_number')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('milk_volume')}
                  >
                    Volume (L) {renderSortIcon('milk_volume')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('temperature')}
                  >
                    Temperature (°C) {renderSortIcon('temperature')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('quality_score')}
                  >
                    Quality {renderSortIcon('quality_score')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('fat_percentage')}
                  >
                    Fat % {renderSortIcon('fat_percentage')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('protein_percentage')}
                  >
                    Protein % {renderSortIcon('protein_percentage')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('acidity')}
                  >
                    pH {renderSortIcon('acidity')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(record.id)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedRows.has(record.id) ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(record.created_at)}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {formatBatchId(record.batch_id)}
                      </TableCell>
                      <TableCell>{record.tank_number || 'N/A'}</TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {Math.abs(record.milk_volume || 0)}
                      </TableCell>
                      <TableCell>{record.temperature || 'N/A'}°C</TableCell>
                      <TableCell>{getQualityBadge(record.quality_score)}</TableCell>
                      <TableCell>{record.fat_percentage || 'N/A'}%</TableCell>
                      <TableCell>{record.protein_percentage || 'N/A'}%</TableCell>
                      <TableCell>{record.acidity || 'N/A'}</TableCell>
                    </TableRow>
                    
                    {expandedRows.has(record.id) && (
                      <TableRow>
                        <TableCell colSpan={10} className="bg-muted/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            <div>
                              <strong>Total Plate Count:</strong> {record.total_plate_count || 'N/A'}
                            </div>
                            <div>
                              <strong>Destination:</strong> {record.destination || 'N/A'}
                            </div>
                            <div>
                              <strong>Notes:</strong> {record.notes || 'No notes'}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOffloadRecords;
