import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMilkReception } from '@/hooks/useMilkReception';
import { format, parseISO } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import MilkBalanceTracker from './MilkBalanceTracker';

const MilkReceptionTable = () => {
  const { data: milkReception, isLoading, error } = useMilkReception();

  const generateMonthlyReport = () => {
    if (!milkReception) return [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return milkReception.filter(record => {
      const recordDate = new Date(record.datetime || record.created_at);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });
  };

  const generateAnnualReport = () => {
    if (!milkReception) return [];
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    return milkReception.filter(record => {
      const recordDate = new Date(record.datetime || record.created_at);
      return recordDate >= yearStart;
    });
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = parseISO(dateString);
      return format(date, 'PPp');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const downloadPDF = (data, title) => {
    const doc = new jsPDF();
    
    const tableData = data.map(record => [
      record.supplier_name,
      record.milk_volume.toFixed(2),
      record.temperature.toFixed(1),
      record.quality_score || 'N/A',
      record.fat_percentage.toFixed(1),
      record.protein_percentage.toFixed(1),
      record.total_plate_count.toLocaleString(),
      record.acidity.toFixed(1),
      formatDate(record.datetime || record.created_at),
    ]);

    doc.text(title, 14, 15);
    doc.autoTable({
      head: [['Supplier', 'Volume (L)', 'Temp (°C)', 'Quality', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time']],
      body: tableData,
      startY: 20,
    });

    doc.save(`milk-reception-${title.toLowerCase()}.pdf`);
  };

  const downloadCSV = (data, title) => {
    const headers = ['Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time'];
    const csvData = data.map(record => 
      [
        record.supplier_name,
        record.milk_volume,
        record.temperature,
        record.quality_score || 'N/A',
        record.fat_percentage,
        record.protein_percentage,
        record.total_plate_count,
        record.acidity,
        formatDate(record.datetime || record.created_at)
      ].join(',')
    );
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `milk-reception-${title.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJPG = async (data, title) => {
    const table = document.querySelector('.milk-reception-table');
    if (table) {
      const canvas = await html2canvas(table);
      const link = document.createElement('a');
      link.download = `milk-reception-${title.toLowerCase()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  if (isLoading) {
    return <div>Loading milk reception data...</div>;
  }

  if (error) {
    return <div>Error loading milk reception data: {error.message}</div>;
  }

  return (
    <>
      <MilkBalanceTracker />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Milk Reception Records</CardTitle>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  const monthlyData = generateMonthlyReport();
                  downloadPDF(monthlyData, 'Monthly-Report');
                }}>
                  Monthly Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const annualData = generateAnnualReport();
                  downloadPDF(annualData, 'Annual-Report');
                }}>
                  Annual Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => downloadPDF(milkReception, 'All-Records')}>
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(milkReception, 'All-Records')}>
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadJPG(milkReception, 'All-Records')}>
                  Download JPG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="milk-reception-table">
            <TableHeader>
              <TableRow>
                <TableHead>Entry Type</TableHead>
                <TableHead>Storage Tank</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Volume (L)</TableHead>
                <TableHead>Temperature (°C)</TableHead>
                <TableHead>Fat %</TableHead>
                <TableHead>Protein %</TableHead>
                <TableHead>TPC</TableHead>
                <TableHead>Acidity</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milkReception?.map((record) => (
                <TableRow 
                  key={record.id}
                  className={record.supplier_name.startsWith('Offload from') ? 'bg-red-50' : ''}
                >
                  <TableCell>
                    {record.supplier_name.startsWith('Offload from') ? 'Tank Offload' : 'Reception'}
                  </TableCell>
                  <TableCell>{record.tank_number || 'N/A'}</TableCell>
                  <TableCell>{record.quality_score || 'N/A'}</TableCell>
                  <TableCell>{record.supplier_name}</TableCell>
                  <TableCell className={record.milk_volume < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                    {record.milk_volume.toFixed(2)}
                  </TableCell>
                  <TableCell>{record.temperature?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>{record.fat_percentage?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>{record.protein_percentage?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>{record.total_plate_count?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{record.acidity?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>{record.destination || 'N/A'}</TableCell>
                  <TableCell>{formatDate(record.datetime || record.created_at)}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default MilkReceptionTable;