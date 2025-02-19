
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Printer, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const RecentOffloadRecords = ({
  records
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!records || records.length === 0) {
    return <p className="text-center text-gray-500">No offload records found</p>;
  }

  const filteredRecords = records
    .filter(record => record.supplier_name?.includes('Offload from'))
    .filter(record => 
      Object.values(record).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    const tableData = filteredRecords.map(record => [
      record.batch_id,
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
      margin: { top: 10 }
    });

    doc.save('milk-offload-records.pdf');
  };

  const downloadExcel = () => {
    const excelData = filteredRecords.map(record => ({
      'Batch ID': record.batch_id,
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
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, 'milk-offload-records.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Tank</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Volume (L)</TableHead>
              <TableHead>Temp (°C)</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Fat %</TableHead>
              <TableHead>Protein %</TableHead>
              <TableHead>Plate Count</TableHead>
              <TableHead>Acidity</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.slice(0, 5).map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.batch_id}</TableCell>
                <TableCell>{record.storage_tank || record.tank_number}</TableCell>
                <TableCell>{format(new Date(record.created_at), 'PPp')}</TableCell>
                <TableCell>{Math.abs(record.milk_volume)}</TableCell>
                <TableCell>{record.temperature}</TableCell>
                <TableCell>{record.quality_score || record.quality_check}</TableCell>
                <TableCell>{record.fat_percentage}</TableCell>
                <TableCell>{record.protein_percentage}</TableCell>
                <TableCell>{record.total_plate_count}</TableCell>
                <TableCell>{record.acidity}</TableCell>
                <TableCell>{record.destination}</TableCell>
                <TableCell>{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
