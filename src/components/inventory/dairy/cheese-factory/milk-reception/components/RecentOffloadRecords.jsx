import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Printer,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const RecentOffloadRecords = ({ offloadRecords = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'offloadTime', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { toast } = useToast();
  const printRef = useRef();

  const filteredAndSortedRecords = React.useMemo(() => {
    let filtered = offloadRecords.filter(record => {
      const matchesSearch = searchTerm === '' || 
        Object.values(record).some(value => 
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (timeFilter === 'all') return true;

      const recordTime = new Date(record.offloadTime);
      const now = new Date();
      
      switch (timeFilter) {
        case 'today':
          return recordTime.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return recordTime >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return recordTime >= monthAgo;
        default:
          return true;
      }
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'offloadTime') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [offloadRecords, searchTerm, timeFilter, sortConfig]);

  const generateBatchId = (record, index) => {
    if (record.batchId && record.batchId !== 'N/A' && record.batchId.trim() !== '') {
      return record.batchId;
    }
    
    const date = new Date(record.offloadTime);
    const dateStr = format(date, 'yyyyMMdd');
    const timeStr = format(date, 'HHmm');
    return `B${dateStr}-${timeStr}-${String(index + 1).padStart(3, '0')}`;
  };

  const getQualityBadge = (record) => {
    const fat = parseFloat(record.qualityParameters?.fat || record.fat || 0);
    const protein = parseFloat(record.qualityParameters?.protein || record.protein || 0);
    const ph = parseFloat(record.qualityParameters?.ph || record.ph || 7);
    
    if (fat >= 3.5 && protein >= 3.0 && ph >= 6.6 && ph <= 6.8) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    } else if (fat >= 3.0 && protein >= 2.5 && ph >= 6.5 && ph <= 6.9) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
    } else if (fat >= 2.5 && protein >= 2.0 && ph >= 6.4 && ph <= 7.0) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Fair</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const toggleRowExpansion = (recordId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Batch ID', 'Farmer Name', 'Offload Time', 'Quantity (L)', 
      'Quality Grade', 'Fat %', 'Protein %', 'pH', 'Tank Number'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedRecords.map((record, index) => [
        generateBatchId(record, index),
        record.farmerName || 'Unknown',
        format(new Date(record.offloadTime), 'yyyy-MM-dd HH:mm:ss'),
        record.quantity || 0,
        record.qualityGrade || 'Not Graded',
        record.qualityParameters?.fat || record.fat || 'N/A',
        record.qualityParameters?.protein || record.protein || 'N/A',
        record.qualityParameters?.ph || record.ph || 'N/A',
        record.tankNumber || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Records exported to CSV successfully"
    });
  };

  const exportToExcel = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredAndSortedRecords.map((record, index) => ({
          'Batch ID': generateBatchId(record, index),
          'Farmer Name': record.farmerName || 'Unknown',
          'Offload Time': format(new Date(record.offloadTime), 'yyyy-MM-dd HH:mm:ss'),
          'Quantity (L)': record.quantity || 0,
          'Quality Grade': record.qualityGrade || 'Not Graded',
          'Fat %': record.qualityParameters?.fat || record.fat || 'N/A',
          'Protein %': record.qualityParameters?.protein || record.protein || 'N/A',
          'pH': record.qualityParameters?.ph || record.ph || 'N/A',
          'Tank Number': record.tankNumber || 'N/A'
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Offload Records');
      XLSX.writeFile(workbook, `milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

      toast({
        title: "Export Successful",
        description: "Records exported to Excel successfully"
      });
    });
  };

  const exportToPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Milk Offload Records', 14, 22);
        doc.setFontSize(12);
        doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 32);

        const tableData = filteredAndSortedRecords.map((record, index) => [
          generateBatchId(record, index),
          record.farmerName || 'Unknown',
          format(new Date(record.offloadTime), 'yyyy-MM-dd HH:mm'),
          `${record.quantity || 0}L`,
          record.qualityGrade || 'Not Graded',
          `${record.qualityParameters?.fat || record.fat || 'N/A'}%`,
          `${record.qualityParameters?.protein || record.protein || 'N/A'}%`,
          record.qualityParameters?.ph || record.ph || 'N/A',
          record.tankNumber || 'N/A'
        ]);

        doc.autoTable({
          startY: 40,
          head: [['Batch ID', 'Farmer', 'Time', 'Quantity', 'Grade', 'Fat%', 'Protein%', 'pH', 'Tank']],
          body: tableData,
          theme: 'striped',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

        toast({
          title: "Export Successful",
          description: "Records exported to PDF successfully"
        });
      });
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Milk Offload Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; white-space: nowrap; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .print-date { color: #666; font-size: 12px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Milk Offload Records</h1>
          <div class="print-date">Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</div>
          <table>
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Farmer Name</th>
                <th>Offload Time</th>
                <th>Quantity (L)</th>
                <th>Quality Grade</th>
                <th>Fat %</th>
                <th>Protein %</th>
                <th>pH</th>
                <th>Tank Number</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedRecords.map((record, index) => `
                <tr>
                  <td>${generateBatchId(record, index)}</td>
                  <td>${record.farmerName || 'Unknown'}</td>
                  <td>${format(new Date(record.offloadTime), 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td>${record.quantity || 0}</td>
                  <td>${record.qualityGrade || 'Not Graded'}</td>
                  <td>${record.qualityParameters?.fat || record.fat || 'N/A'}</td>
                  <td>${record.qualityParameters?.protein || record.protein || 'N/A'}</td>
                  <td>${record.qualityParameters?.ph || record.ph || 'N/A'}</td>
                  <td>${record.tankNumber || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    toast({
      title: "Print Successful",
      description: "Records sent to printer successfully"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Offload Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading records...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!offloadRecords.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Offload Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">No offload records found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Offload Records
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
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
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[120px]" onClick={() => handleSort('batchId')}>
                    Batch ID {getSortIcon('batchId')}
                  </TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[150px]" onClick={() => handleSort('farmerName')}>
                    Farmer Name {getSortIcon('farmerName')}
                  </TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[160px]" onClick={() => handleSort('offloadTime')}>
                    Offload Time {getSortIcon('offloadTime')}
                  </TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[100px]" onClick={() => handleSort('quantity')}>
                    Quantity (L) {getSortIcon('quantity')}
                  </TableHead>
                  <TableHead className="whitespace-nowrap min-w-[120px]">Quality Grade</TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[80px]" onClick={() => handleSort('fat')}>
                    Fat % {getSortIcon('fat')}
                  </TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[90px]" onClick={() => handleSort('protein')}>
                    Protein % {getSortIcon('protein')}
                  </TableHead>
                  <TableHead className="cursor-pointer whitespace-nowrap min-w-[60px]" onClick={() => handleSort('ph')}>
                    pH {getSortIcon('ph')}
                  </TableHead>
                  <TableHead className="whitespace-nowrap min-w-[100px]">Tank Number</TableHead>
                  <TableHead className="whitespace-nowrap min-w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedRecords.map((record, index) => (
                  <React.Fragment key={record.id || index}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">
                        {generateBatchId(record, index)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.farmerName || 'Unknown'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(record.offloadTime), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {record.quantity || 0}L
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getQualityBadge(record)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {record.qualityParameters?.fat || record.fat || 'N/A'}%
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {record.qualityParameters?.protein || record.protein || 'N/A'}%
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {record.qualityParameters?.ph || record.ph || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.tankNumber || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(record.id || index)}
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(record.id || index) && (
                      <TableRow className="bg-muted/25">
                        <TableCell colSpan={10} className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Temperature:</span>
                              <br />
                              {record.qualityParameters?.temperature || record.temperature || 'N/A'}°C
                            </div>
                            <div>
                              <span className="font-medium">Density:</span>
                              <br />
                              {record.qualityParameters?.density || record.density || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">SCC:</span>
                              <br />
                              {record.qualityParameters?.somaticCellCount || record.somaticCellCount || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Notes:</span>
                              <br />
                              {record.notes || 'No notes'}
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
        </div>

        {filteredAndSortedRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No records match your search criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOffloadRecords;
