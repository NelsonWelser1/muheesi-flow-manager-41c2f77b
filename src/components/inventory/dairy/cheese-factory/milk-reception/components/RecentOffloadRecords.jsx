
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RecentOffloadRecords = ({ records = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Filter records based on search and status
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      Object.values(record).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || record.quality_check === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Generate batch ID if missing
  const generateBatchId = (record, index) => {
    if (record.batch_id && record.batch_id !== 'N/A' && record.batch_id.trim() !== '') {
      return record.batch_id;
    }
    const date = new Date(record.offload_date || record.created_at);
    const dateStr = format(date, 'yyyyMMdd');
    const timeStr = format(date, 'HHmm');
    return `BATCH-${dateStr}-${timeStr}-${String(index + 1).padStart(3, '0')}`;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Batch ID',
      'Tank Number', 
      'Volume (L)',
      'Destination',
      'Temperature (°C)',
      'Quality Check',
      'Offload Date',
      'Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record, index) => [
        `"${generateBatchId(record, index)}"`,
        `"${record.tank_number || 'N/A'}"`,
        `"${record.volume_offloaded || 0}"`,
        `"${record.destination || 'N/A'}"`,
        `"${record.temperature || 'N/A'}"`,
        `"${record.quality_check || 'Pass'}"`,
        `"${format(new Date(record.offload_date || record.created_at), 'yyyy-MM-dd HH:mm')}"`,
        `"${record.notes || 'N/A'}"`
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
      description: "Records exported to CSV successfully."
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map((record, index) => ({
        'Batch ID': generateBatchId(record, index),
        'Tank Number': record.tank_number || 'N/A',
        'Volume (L)': record.volume_offloaded || 0,
        'Destination': record.destination || 'N/A',
        'Temperature (°C)': record.temperature || 'N/A',
        'Quality Check': record.quality_check || 'Pass',
        'Offload Date': format(new Date(record.offload_date || record.created_at), 'yyyy-MM-dd HH:mm'),
        'Notes': record.notes || 'N/A'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Offload Records');
    XLSX.writeFile(workbook, `milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    toast({
      title: "Export Successful", 
      description: "Records exported to Excel successfully."
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Milk Offload Records', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 32);

    const tableData = filteredRecords.map((record, index) => [
      generateBatchId(record, index),
      record.tank_number || 'N/A',
      `${record.volume_offloaded || 0}L`,
      record.destination || 'N/A', 
      `${record.temperature || 'N/A'}°C`,
      record.quality_check || 'Pass',
      format(new Date(record.offload_date || record.created_at), 'yyyy-MM-dd HH:mm'),
      record.notes || 'N/A'
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Batch ID', 'Tank', 'Volume', 'Destination', 'Temp', 'Quality', 'Date', 'Notes']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

    toast({
      title: "Export Successful",
      description: "Records exported to PDF successfully."
    });
  };

  // Print functionality
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
                <th>Tank Number</th>
                <th>Volume (L)</th>
                <th>Destination</th>
                <th>Temperature (°C)</th>
                <th>Quality Check</th>
                <th>Offload Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map((record, index) => `
                <tr>
                  <td>${generateBatchId(record, index)}</td>
                  <td>${record.tank_number || 'N/A'}</td>
                  <td>${record.volume_offloaded || 0}</td>
                  <td>${record.destination || 'N/A'}</td>
                  <td>${record.temperature || 'N/A'}</td>
                  <td>${record.quality_check || 'Pass'}</td>
                  <td>${format(new Date(record.offload_date || record.created_at), 'yyyy-MM-dd HH:mm')}</td>
                  <td>${record.notes || 'N/A'}</td>
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
      description: "Records sent to printer successfully."
    });
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality) {
      case 'Pass':
        return 'bg-green-100 text-green-800';
      case 'Fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Offload Records</CardTitle>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {searchTerm || statusFilter !== 'all' ? 'No records found matching your criteria.' : 'No offload records available.'}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Batch ID</TableHead>
                  <TableHead className="whitespace-nowrap">Tank Number</TableHead>
                  <TableHead className="whitespace-nowrap">Volume (L)</TableHead>
                  <TableHead className="whitespace-nowrap">Destination</TableHead>
                  <TableHead className="whitespace-nowrap">Temperature (°C)</TableHead>
                  <TableHead className="whitespace-nowrap">Quality Check</TableHead>
                  <TableHead className="whitespace-nowrap">Offload Date</TableHead>
                  <TableHead className="whitespace-nowrap">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={record.id || index}>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {generateBatchId(record, index)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.tank_number || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.volume_offloaded || 0}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.destination || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.temperature || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge className={getQualityBadgeColor(record.quality_check)}>
                        {record.quality_check || 'Pass'}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(record.offload_date || record.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                      {record.notes || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOffloadRecords;
