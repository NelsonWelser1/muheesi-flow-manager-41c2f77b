
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Printer, Search, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

export const RecentOffloadRecords = ({
  records
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { toast } = useToast();

  if (!records || records.length === 0) {
    return <p className="text-center text-gray-500">No offload records found</p>;
  }

  const filteredRecords = records
    .filter(record => record.supplier_name?.includes('Offload from'))
    .filter(record => 
      Object.values(record).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(record => !record.batch_id?.startsWith('LEGACY-')); // Filter out legacy batch IDs

  const handlePrint = () => {
    window.print();
  };

  const generateReport = (type) => {
    if (filteredRecords.length === 0) {
      toast({
        title: "No Data",
        description: "No records available to generate report",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Calculate summary data for the report
    const totalVolume = filteredRecords.reduce((sum, record) => sum + Math.abs(record.milk_volume || 0), 0);
    const avgTemperature = filteredRecords.length > 0 
      ? filteredRecords.reduce((sum, record) => sum + (record.temperature || 0), 0) / filteredRecords.length 
      : 0;
    const avgFatPercentage = filteredRecords.length > 0
      ? filteredRecords.reduce((sum, record) => sum + (record.fat_percentage || 0), 0) / filteredRecords.length
      : 0;
    const avgProteinPercentage = filteredRecords.length > 0
      ? filteredRecords.reduce((sum, record) => sum + (record.protein_percentage || 0), 0) / filteredRecords.length
      : 0;

    setReportData({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Milk Offload Report`,
      records: filteredRecords,
      summary: {
        totalRecords: filteredRecords.length,
        totalVolume: totalVolume.toFixed(2),
        avgTemperature: avgTemperature.toFixed(1),
        avgFatPercentage: avgFatPercentage.toFixed(1),
        avgProteinPercentage: avgProteinPercentage.toFixed(1)
      }
    });
    
    setShowReport(true);
    
    toast({
      title: "Report Generated",
      description: `Milk offload report generated successfully`,
      duration: 3000,
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title and summary if report is active
    if (reportData) {
      doc.setFontSize(18);
      doc.text(reportData.title, 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'PPp')}`, 14, 25);
      doc.text(`Total Records: ${reportData.summary.totalRecords}`, 14, 35);
      doc.text(`Total Volume: ${reportData.summary.totalVolume} L`, 14, 42);
      doc.text(`Avg Temperature: ${reportData.summary.avgTemperature} °C`, 14, 49);
      doc.text(`Avg Fat %: ${reportData.summary.avgFatPercentage}%`, 14, 56);
      doc.text(`Avg Protein %: ${reportData.summary.avgProteinPercentage}%`, 14, 63);
      
      const startY = 70;
    } else {
      doc.setFontSize(18);
      doc.text('Milk Offload Records', 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'PPp')}`, 14, 25);
      
      const startY = 35;
    }
    
    const dataToUse = reportData ? reportData.records : filteredRecords;
    
    const tableData = dataToUse.map(record => [
      record.batch_id || '',
      record.storage_tank || record.tank_number,
      format(new Date(record.created_at), 'PPp'),
      Math.abs(record.milk_volume),
      record.temperature,
      record.quality_score || record.quality_check,
      record.fat_percentage,
      record.protein_percentage,
      record.total_plate_count,
      record.acidity,
      record.destination,
      record.notes
    ]);

    doc.autoTable({
      head: [['Batch ID', 'Tank', 'Date', 'Volume (L)', 'Temp (°C)', 'Quality', 'Fat %', 'Protein %', 'Plate Count', 'Acidity', 'Destination', 'Notes']],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: reportData ? 70 : 35 }
    });

    doc.save(reportData ? `${reportData.title.toLowerCase().replace(/\s+/g, '-')}.pdf` : 'milk-offload-records.pdf');
  };

  const downloadExcel = () => {
    const dataToUse = reportData ? reportData.records : filteredRecords;
    const title = reportData ? reportData.title : 'Milk Offload Records';
    
    // Add summary row if we have report data
    const summaryRow = reportData ? [{
      'Batch ID': 'SUMMARY',
      'Tank': '',
      'Date': format(new Date(), 'PPp'),
      'Volume (L)': reportData.summary.totalVolume,
      'Temperature (°C)': reportData.summary.avgTemperature,
      'Quality': '',
      'Fat %': reportData.summary.avgFatPercentage,
      'Protein %': reportData.summary.avgProteinPercentage,
      'Plate Count': '',
      'Acidity': '',
      'Destination': '',
      'Notes': 'Generated Report'
    }] : [];
    
    const excelData = [
      ...summaryRow,
      ...dataToUse.map(record => ({
        'Batch ID': record.batch_id || '',
        'Tank': record.storage_tank || record.tank_number,
        'Date': format(new Date(record.created_at), 'PPp'),
        'Volume (L)': Math.abs(record.milk_volume),
        'Temperature (°C)': record.temperature,
        'Quality': record.quality_score || record.quality_check,
        'Fat %': record.fat_percentage,
        'Protein %': record.protein_percentage,
        'Plate Count': record.total_plate_count,
        'Acidity': record.acidity,
        'Destination': record.destination,
        'Notes': record.notes
      }))
    ];

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => generateReport('daily')}>
                Daily Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateReport('weekly')}>
                Weekly Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generateReport('monthly')}>
                Monthly Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {showReport && reportData && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{reportData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Total Records</div>
                <div className="text-xl font-bold">{reportData.summary.totalRecords}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Total Volume</div>
                <div className="text-xl font-bold">{reportData.summary.totalVolume} L</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Avg Temperature</div>
                <div className="text-xl font-bold">{reportData.summary.avgTemperature} °C</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Avg Fat %</div>
                <div className="text-xl font-bold">{reportData.summary.avgFatPercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap px-6">Batch ID</TableHead>
              <TableHead className="whitespace-nowrap px-6">Tank</TableHead>
              <TableHead className="whitespace-nowrap px-6">Date</TableHead>
              <TableHead className="whitespace-nowrap px-6">Volume (L)</TableHead>
              <TableHead className="whitespace-nowrap px-6">Temp (°C)</TableHead>
              <TableHead className="whitespace-nowrap px-6">Quality</TableHead>
              <TableHead className="whitespace-nowrap px-6">Fat %</TableHead>
              <TableHead className="whitespace-nowrap px-6">Protein %</TableHead>
              <TableHead className="whitespace-nowrap px-6">Plate Count</TableHead>
              <TableHead className="whitespace-nowrap px-6">Acidity</TableHead>
              <TableHead className="whitespace-nowrap px-6">Destination</TableHead>
              <TableHead className="whitespace-nowrap px-6">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.slice(0, reportData ? filteredRecords.length : 5).map(record => (
              <TableRow key={record.id}>
                <TableCell className="whitespace-nowrap px-6 min-w-[150px] font-medium">
                  {record.batch_id || ''}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{record.storage_tank || record.tank_number}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[180px]">{format(new Date(record.created_at), 'PPp')}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{Math.abs(record.milk_volume)}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{record.temperature}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{record.quality_score || record.quality_check}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[80px]">{record.fat_percentage}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{record.protein_percentage}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.total_plate_count}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">{record.acidity}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">{record.destination}</TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[200px]">{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOffloadRecords;
