import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useQueryClient } from '@tanstack/react-query';
import { useMilkReception } from '@/hooks/useMilkReception';
import { format, parseISO } from 'date-fns';
import { Download, FileText, Search, RefreshCw, Columns } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import MilkBalanceTracker from './MilkBalanceTracker';

const MilkReceptionTable = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    entryType: true,
    storageTank: true,
    qualityScore: true,
    supplier: true,
    volume: true,
    temperature: true,
    fat: true,
    protein: true,
    tpc: true,
    acidity: true,
    destination: true,
    dateTime: true,
    notes: true
  });

  const {
    data: milkReception,
    isLoading,
    error
  } = useMilkReception();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['milkReceptions'] });
  };

  const toggleColumnVisibility = (column) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const filteredRecords = React.useMemo(() => {
    if (!milkReception) return [];
    return milkReception.filter(record => 
      Object.values(record).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [milkReception, searchTerm]);

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

  const formatDate = dateString => {
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
    const tableData = data.map(record => [record.supplier_name, record.milk_volume.toFixed(2), record.temperature.toFixed(1), record.quality_score || 'N/A', record.fat_percentage.toFixed(1), record.protein_percentage.toFixed(1), record.total_plate_count.toLocaleString(), record.acidity.toFixed(1), formatDate(record.datetime || record.created_at)]);
    doc.text(title, 14, 15);
    doc.autoTable({
      head: [['Supplier', 'Volume (L)', 'Temp (°C)', 'Quality', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time']],
      body: tableData,
      startY: 20
    });
    doc.save(`milk-reception-${title.toLowerCase()}.pdf`);
  };

  const downloadCSV = (data, title) => {
    const headers = ['Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time'];
    const csvData = data.map(record => [record.supplier_name, record.milk_volume, record.temperature, record.quality_score || 'N/A', record.fat_percentage, record.protein_percentage, record.total_plate_count, record.acidity, formatDate(record.datetime || record.created_at)].join(','));
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
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

  return <>
      <MilkBalanceTracker />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-[13px] px-[22px] my-0 mx-0">
          <CardTitle>Milk Reception Records</CardTitle>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.entryType}
                  onCheckedChange={() => toggleColumnVisibility('entryType')}
                >
                  Entry Type
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.storageTank}
                  onCheckedChange={() => toggleColumnVisibility('storageTank')}
                >
                  Storage Tank
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.qualityScore}
                  onCheckedChange={() => toggleColumnVisibility('qualityScore')}
                >
                  Quality Score
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.supplier}
                  onCheckedChange={() => toggleColumnVisibility('supplier')}
                >
                  Supplier
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.volume}
                  onCheckedChange={() => toggleColumnVisibility('volume')}
                >
                  Volume (L)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.temperature}
                  onCheckedChange={() => toggleColumnVisibility('temperature')}
                >
                  Temperature (°C)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.fat}
                  onCheckedChange={() => toggleColumnVisibility('fat')}
                >
                  Fat %
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.protein}
                  onCheckedChange={() => toggleColumnVisibility('protein')}
                >
                  Protein %
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.tpc}
                  onCheckedChange={() => toggleColumnVisibility('tpc')}
                >
                  TPC
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.acidity}
                  onCheckedChange={() => toggleColumnVisibility('acidity')}
                >
                  Acidity
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.destination}
                  onCheckedChange={() => toggleColumnVisibility('destination')}
                >
                  Destination
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.dateTime}
                  onCheckedChange={() => toggleColumnVisibility('dateTime')}
                >
                  Date & Time
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.notes}
                  onCheckedChange={() => toggleColumnVisibility('notes')}
                >
                  Notes
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                <DropdownMenuItem onClick={() => downloadPDF(filteredRecords, 'All-Records')}>
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(filteredRecords, 'All-Records')}>
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadJPG(filteredRecords, 'All-Records')}>
                  Download JPG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="w-full overflow-auto">
              <Table className="milk-reception-table relative w-full">
                <TableHeader>
                  <TableRow>
                    {columnVisibility.entryType && (
                      <TableHead className="min-w-[120px] whitespace-nowrap">Entry Type</TableHead>
                    )}
                    {columnVisibility.storageTank && (
                      <TableHead className="min-w-[120px] whitespace-nowrap">Storage Tank</TableHead>
                    )}
                    {columnVisibility.qualityScore && (
                      <TableHead className="min-w-[100px] whitespace-nowrap">Quality Score</TableHead>
                    )}
                    {columnVisibility.supplier && (
                      <TableHead className="min-w-[150px] whitespace-nowrap">Supplier</TableHead>
                    )}
                    {columnVisibility.volume && (
                      <TableHead className="min-w-[100px] whitespace-nowrap">Volume (L)</TableHead>
                    )}
                    {columnVisibility.temperature && (
                      <TableHead className="min-w-[120px] whitespace-nowrap">Temperature (°C)</TableHead>
                    )}
                    {columnVisibility.fat && (
                      <TableHead className="min-w-[80px] whitespace-nowrap">Fat %</TableHead>
                    )}
                    {columnVisibility.protein && (
                      <TableHead className="min-w-[100px] whitespace-nowrap">Protein %</TableHead>
                    )}
                    {columnVisibility.tpc && (
                      <TableHead className="min-w-[100px] whitespace-nowrap">TPC</TableHead>
                    )}
                    {columnVisibility.acidity && (
                      <TableHead className="min-w-[100px] whitespace-nowrap">Acidity</TableHead>
                    )}
                    {columnVisibility.destination && (
                      <TableHead className="min-w-[120px] whitespace-nowrap">Destination</TableHead>
                    )}
                    {columnVisibility.dateTime && (
                      <TableHead className="min-w-[180px] whitespace-nowrap">Date & Time</TableHead>
                    )}
                    {columnVisibility.notes && (
                      <TableHead className="min-w-[200px] whitespace-nowrap">Notes</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id} className={record.supplier_name.startsWith('Offload from') ? 'bg-red-50' : ''}>
                      {columnVisibility.entryType && (
                        <TableCell className="whitespace-nowrap">
                          {record.supplier_name.startsWith('Offload from') ? 'Tank Offload' : 'Reception'}
                        </TableCell>
                      )}
                      {columnVisibility.storageTank && (
                        <TableCell className="whitespace-nowrap">{record.tank_number || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.qualityScore && (
                        <TableCell className="whitespace-nowrap">{record.quality_score || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.supplier && (
                        <TableCell className="whitespace-nowrap">{record.supplier_name}</TableCell>
                      )}
                      {columnVisibility.volume && (
                        <TableCell className={`whitespace-nowrap ${record.milk_volume < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                          {record.milk_volume.toFixed(2)}
                        </TableCell>
                      )}
                      {columnVisibility.temperature && (
                        <TableCell className="whitespace-nowrap">{record.temperature?.toFixed(1) || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.fat && (
                        <TableCell className="whitespace-nowrap">{record.fat_percentage?.toFixed(1) || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.protein && (
                        <TableCell className="whitespace-nowrap">{record.protein_percentage?.toFixed(1) || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.tpc && (
                        <TableCell className="whitespace-nowrap">{record.total_plate_count?.toLocaleString() || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.acidity && (
                        <TableCell className="whitespace-nowrap">{record.acidity?.toFixed(1) || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.destination && (
                        <TableCell className="whitespace-nowrap">{record.destination || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.dateTime && (
                        <TableCell className="whitespace-nowrap">{formatDate(record.datetime || record.created_at)}</TableCell>
                      )}
                      {columnVisibility.notes && (
                        <TableCell className="max-w-xs truncate">{record.notes || 'N/A'}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>;
};

export default MilkReceptionTable;
