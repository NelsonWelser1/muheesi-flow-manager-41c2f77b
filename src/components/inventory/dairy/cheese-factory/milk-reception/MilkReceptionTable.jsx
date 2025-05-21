
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQueryClient } from '@tanstack/react-query';
import { useMilkReception } from '@/hooks/useMilkReception';
import { format, parseISO, startOfToday, endOfToday, subDays } from 'date-fns';
import { Download, FileText, Search, RefreshCw, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import MilkBalanceTracker from './MilkBalanceTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const MilkReceptionTable = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('all');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();
  const {
    data: milkReception,
    isLoading,
    error
  } = useMilkReception();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['milkReceptions'] });
  };

  const filteredRecords = React.useMemo(() => {
    if (!milkReception) return [];
    return milkReception.filter(record => 
      Object.values(record).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [milkReception, searchTerm]);

  // Function to generate reports based on selected type
  const generateReport = (type) => {
    setReportType(type);
    if (!milkReception || milkReception.length === 0) {
      toast({
        title: "No Data",
        description: "No records available to generate report",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    let filteredData = [];
    const now = new Date();

    switch (type) {
      case 'daily':
        // Today's data
        filteredData = milkReception.filter(record => {
          const recordDate = new Date(record.datetime || record.created_at);
          return recordDate >= startOfToday() && recordDate <= endOfToday();
        });
        break;
      case 'yesterday':
        // Yesterday's data
        const yesterday = subDays(now, 1);
        filteredData = milkReception.filter(record => {
          const recordDate = new Date(record.datetime || record.created_at);
          return recordDate >= startOfToday(yesterday) && recordDate <= endOfToday(yesterday);
        });
        break;
      case 'monthly':
        // Current month's data
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filteredData = milkReception.filter(record => {
          const recordDate = new Date(record.datetime || record.created_at);
          return recordDate >= monthStart && recordDate <= monthEnd;
        });
        break;
      case 'annual':
        // Current year's data
        const yearStart = new Date(now.getFullYear(), 0, 1);
        filteredData = milkReception.filter(record => {
          const recordDate = new Date(record.datetime || record.created_at);
          return recordDate >= yearStart;
        });
        break;
      default:
        filteredData = milkReception;
    }

    // Calculate summary data for the report
    const totalVolume = filteredData.reduce((sum, record) => sum + Math.abs(Number(record.milk_volume) || 0), 0);
    const avgTemperature = filteredData.length > 0 
      ? filteredData.reduce((sum, record) => sum + (Number(record.temperature) || 0), 0) / filteredData.length 
      : 0;
    const avgFatPercentage = filteredData.length > 0
      ? filteredData.reduce((sum, record) => sum + (Number(record.fat_percentage) || 0), 0) / filteredData.length
      : 0;
    const avgProteinPercentage = filteredData.length > 0
      ? filteredData.reduce((sum, record) => sum + (Number(record.protein_percentage) || 0), 0) / filteredData.length
      : 0;

    setReportData({
      records: filteredData,
      summary: {
        totalRecords: filteredData.length,
        totalVolume: totalVolume.toFixed(2),
        avgTemperature: avgTemperature.toFixed(1),
        avgFatPercentage: avgFatPercentage.toFixed(1),
        avgProteinPercentage: avgProteinPercentage.toFixed(1)
      }
    });
    
    setShowReport(true);
    
    toast({
      title: "Report Generated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`,
      duration: 3000,
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

  const downloadReport = (format) => {
    if (!reportData.records || reportData.records.length === 0) {
      toast({
        title: "No Data",
        description: "No report data available to download",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}-Milk-Reception-Report`;
    
    switch (format) {
      case 'pdf':
        downloadPDF(reportData.records, title);
        break;
      case 'excel':
        downloadExcel(reportData.records, title);
        break;
      case 'csv':
        downloadCSV(reportData.records, title);
        break;
      case 'jpg':
        downloadJPG(reportData.records, title);
        break;
      default:
        console.error('Unsupported format:', format);
    }
  };

  const downloadPDF = (data, title) => {
    const doc = new jsPDF();
    
    // Add report title and summary
    doc.setFontSize(18);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPp')}`, 14, 25);
    
    if (reportData.summary) {
      doc.text(`Total Records: ${reportData.summary.totalRecords}`, 14, 35);
      doc.text(`Total Volume: ${reportData.summary.totalVolume} L`, 14, 42);
      doc.text(`Avg Temperature: ${reportData.summary.avgTemperature} °C`, 14, 49);
      doc.text(`Avg Fat %: ${reportData.summary.avgFatPercentage}%`, 14, 56);
      doc.text(`Avg Protein %: ${reportData.summary.avgProteinPercentage}%`, 14, 63);
    }
    
    const tableData = data.map(record => [
      record.supplier_name, 
      record.milk_volume.toFixed(2), 
      record.temperature?.toFixed(1) || 'N/A', 
      record.quality_score || 'N/A', 
      record.fat_percentage?.toFixed(1) || 'N/A', 
      record.protein_percentage?.toFixed(1) || 'N/A', 
      record.total_plate_count?.toLocaleString() || 'N/A', 
      record.acidity?.toFixed(1) || 'N/A', 
      formatDate(record.datetime || record.created_at)
    ]);
    
    doc.autoTable({
      head: [['Supplier', 'Volume (L)', 'Temp (°C)', 'Quality', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time']],
      body: tableData,
      startY: 70
    });
    
    doc.save(`${title}.pdf`);
  };

  const downloadExcel = (data, title) => {
    const summaryRow = reportData.summary ? [{
      'Supplier': 'SUMMARY',
      'Volume (L)': reportData.summary.totalVolume,
      'Temperature (°C)': reportData.summary.avgTemperature,
      'Quality Score': '',
      'Fat %': reportData.summary.avgFatPercentage,
      'Protein %': reportData.summary.avgProteinPercentage,
      'TPC': '',
      'Acidity': '',
      'Date & Time': format(new Date(), 'PPp')
    }] : [];
    
    const excelData = [
      ...summaryRow,
      ...data.map(record => ({
        'Supplier': record.supplier_name,
        'Volume (L)': record.milk_volume,
        'Temperature (°C)': record.temperature || 'N/A',
        'Quality Score': record.quality_score || 'N/A',
        'Fat %': record.fat_percentage || 'N/A',
        'Protein %': record.protein_percentage || 'N/A',
        'TPC': record.total_plate_count || 'N/A',
        'Acidity': record.acidity || 'N/A',
        'Date & Time': formatDate(record.datetime || record.created_at)
      }))
    ];
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  const downloadCSV = (data, title) => {
    const headers = ['Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score', 'Fat %', 'Protein %', 'TPC', 'Acidity', 'Date & Time'];
    const csvData = data.map(record => [
      record.supplier_name,
      record.milk_volume,
      record.temperature || '',
      record.quality_score || '',
      record.fat_percentage || '',
      record.protein_percentage || '',
      record.total_plate_count || '',
      record.acidity || '',
      formatDate(record.datetime || record.created_at)
    ].join(','));
    
    const summaryRow = reportData.summary ? 
      `SUMMARY,${reportData.summary.totalVolume},${reportData.summary.avgTemperature},,${reportData.summary.avgFatPercentage},${reportData.summary.avgProteinPercentage},,,${format(new Date(), 'PPp')}` : '';
    
    const csvContent = [
      headers.join(','),
      summaryRow,
      ...csvData
    ].join('\n');
    
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJPG = async (data, title) => {
    const reportElement = document.querySelector('.milk-reception-report');
    if (reportElement) {
      try {
        const canvas = await html2canvas(reportElement);
        const link = document.createElement('a');
        link.download = `${title}.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      } catch (error) {
        console.error('Error generating JPG:', error);
        toast({
          title: "Error",
          description: "Failed to generate JPG. Please try another format.",
          variant: "destructive",
          duration: 5000,
        });
      }
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
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => generateReport('daily')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Daily Report (Today)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport('yesterday')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Yesterday's Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport('monthly')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport('annual')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Annual Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {showReport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => downloadReport('pdf')}>
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('excel')}>
                    Download Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('csv')}>
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('jpg')}>
                    Download JPG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="records">All Records</TabsTrigger>
              {showReport && <TabsTrigger value="report">Report</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="records">
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
                        <TableHead className="min-w-[120px] whitespace-nowrap">Entry Type</TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">Storage Tank</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">Quality Score</TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap">Supplier</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">Volume (L)</TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">Temperature (°C)</TableHead>
                        <TableHead className="min-w-[80px] whitespace-nowrap">Fat %</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">Protein %</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">TPC</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">Acidity</TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap">Destination</TableHead>
                        <TableHead className="min-w-[180px] whitespace-nowrap">Date & Time</TableHead>
                        <TableHead className="min-w-[200px] whitespace-nowrap">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map(record => (
                        <TableRow key={record.id} className={record.supplier_name.startsWith('Offload from') ? 'bg-red-50' : ''}>
                          <TableCell className="whitespace-nowrap">
                            {record.supplier_name.startsWith('Offload from') ? 'Tank Offload' : 'Reception'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{record.tank_number || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.quality_score || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.supplier_name}</TableCell>
                          <TableCell className={`whitespace-nowrap ${record.milk_volume < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                            {record.milk_volume.toFixed(2)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{record.temperature?.toFixed(1) || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.fat_percentage?.toFixed(1) || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.protein_percentage?.toFixed(1) || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.total_plate_count?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.acidity?.toFixed(1) || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{record.destination || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(record.datetime || record.created_at)}</TableCell>
                          <TableCell className="max-w-xs truncate">{record.notes || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {showReport && (
              <TabsContent value="report">
                <div className="milk-reception-report space-y-6 p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Milk Reception Report
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generated on {format(new Date(), 'PPp')}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-sm font-semibold">
                        Total Records: <span className="font-normal">{reportData.summary?.totalRecords || 0}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
                        <div className="text-2xl font-bold">{reportData.summary?.totalVolume || 0} L</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Temperature</div>
                        <div className="text-2xl font-bold">{reportData.summary?.avgTemperature || 0} °C</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Fat %</div>
                        <div className="text-2xl font-bold">{reportData.summary?.avgFatPercentage || 0}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Avg Protein %</div>
                        <div className="text-2xl font-bold">{reportData.summary?.avgProteinPercentage || 0}%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="w-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Supplier</TableHead>
                            <TableHead className="min-w-[100px]">Volume (L)</TableHead>
                            <TableHead className="min-w-[120px]">Temperature (°C)</TableHead>
                            <TableHead className="min-w-[100px]">Quality Score</TableHead>
                            <TableHead className="min-w-[80px]">Fat %</TableHead>
                            <TableHead className="min-w-[100px]">Protein %</TableHead>
                            <TableHead className="min-w-[100px]">TPC</TableHead>
                            <TableHead className="min-w-[100px]">Acidity</TableHead>
                            <TableHead className="min-w-[180px]">Date & Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportData.records && reportData.records.map((record, index) => (
                            <TableRow key={`report-${record.id || index}`}>
                              <TableCell className="whitespace-nowrap">{record.supplier_name}</TableCell>
                              <TableCell className={`whitespace-nowrap ${record.milk_volume < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                                {record.milk_volume.toFixed(2)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">{record.temperature?.toFixed(1) || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{record.quality_score || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{record.fat_percentage?.toFixed(1) || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{record.protein_percentage?.toFixed(1) || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{record.total_plate_count?.toLocaleString() || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{record.acidity?.toFixed(1) || 'N/A'}</TableCell>
                              <TableCell className="whitespace-nowrap">{formatDate(record.datetime || record.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </>;
};

export default MilkReceptionTable;
