import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Printer, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const RecentOffloadRecords = ({
  records
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllRecords, setShowAllRecords] = useState(false);

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
    if (filteredRecords.length === 0) {
      alert('No offload records available to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Milk Offload Records Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 { 
              color: #333; 
              margin: 0 0 10px 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header .subtitle {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .summary {
              margin: 20px 0;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .summary h3 {
              margin: 0 0 10px 0;
              color: #333;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
              vertical-align: top;
            }
            th { 
              background-color: #4a5568; 
              color: white;
              font-weight: bold;
              font-size: 11px;
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            tr:hover { 
              background-color: #f0f0f0; 
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .volume-negative {
              color: #dc2626;
              font-weight: bold;
            }
            .volume-positive {
              color: #16a34a;
              font-weight: bold;
            }
            @media print { 
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Milk Tank Offload Records Report</h1>
            <div class="subtitle">Generated on: ${format(new Date(), 'PPPP')}</div>
            <div class="subtitle">Report Time: ${format(new Date(), 'HH:mm:ss')}</div>
          </div>
          
          <div class="summary">
            <h3>Report Summary</h3>
            <p><strong>Total Offload Records:</strong> ${filteredRecords.length}</p>
            <p><strong>Total Volume Offloaded:</strong> ${filteredRecords.reduce((sum, record) => sum + Math.abs(record.milk_volume || 0), 0).toFixed(1)} L</p>
            <p><strong>Date Range:</strong> ${filteredRecords.length > 0 ? 
              `${format(new Date(Math.min(...filteredRecords.map(r => new Date(r.created_at)))), 'MMM dd, yyyy')} - ${format(new Date(Math.max(...filteredRecords.map(r => new Date(r.created_at)))), 'MMM dd, yyyy')}` 
              : 'N/A'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 12%;">Batch ID</th>
                <th style="width: 10%;">Source Tank</th>
                <th style="width: 15%;">Date & Time</th>
                <th style="width: 8%;">Volume (L)</th>
                <th style="width: 8%;">Temperature (°C)</th>
                <th style="width: 8%;">Quality Grade</th>
                <th style="width: 6%;">Fat %</th>
                <th style="width: 7%;">Protein %</th>
                <th style="width: 8%;">Plate Count</th>
                <th style="width: 6%;">Acidity</th>
                <th style="width: 12%;">Destination</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => `
                <tr>
                  <td style="font-family: monospace; font-weight: bold;">${record.batch_id || 'N/A'}</td>
                  <td>${record.storage_tank || record.tank_number || 'N/A'}</td>
                  <td>${format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}</td>
                  <td class="${record.milk_volume < 0 ? 'volume-negative' : 'volume-positive'}">${Math.abs(record.milk_volume || 0)}</td>
                  <td>${record.temperature || 'N/A'}</td>
                  <td>${record.quality_score || record.quality_check || 'N/A'}</td>
                  <td>${record.fat_percentage || 'N/A'}</td>
                  <td>${record.protein_percentage || 'N/A'}</td>
                  <td>${record.total_plate_count || 'N/A'}</td>
                  <td>${record.acidity || 'N/A'}</td>
                  <td>${record.destination || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report contains ${filteredRecords.length} milk tank offload records</p>
            <p>Printed from Milk Reception Management System</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    const tableData = filteredRecords.map(record => [
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
      margin: { top: 10 }
    });

    doc.save('milk-offload-records.pdf');
  };

  const downloadExcel = () => {
    const excelData = filteredRecords.map(record => ({
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
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, 'milk-offload-records.xlsx');
  };

  const displayedRecords = showAllRecords ? filteredRecords : filteredRecords.slice(0, 5);

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

      {/* Summary Information */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Total Records:</span>
            <div className="text-lg font-bold text-blue-600">{filteredRecords.length}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Total Volume Offloaded:</span>
            <div className="text-lg font-bold text-blue-600">
              {filteredRecords.reduce((sum, record) => sum + Math.abs(record.milk_volume || 0), 0).toFixed(1)}L
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Date Range:</span>
            <div className="text-sm text-blue-600">
              {filteredRecords.length > 0 ? 
                `${format(new Date(Math.min(...filteredRecords.map(r => new Date(r.created_at)))), 'MMM dd')} - ${format(new Date(Math.max(...filteredRecords.map(r => new Date(r.created_at)))), 'MMM dd, yyyy')}` 
                : 'N/A'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Average Volume:</span>
            <div className="text-lg font-bold text-blue-600">
              {filteredRecords.length > 0 ? (filteredRecords.reduce((sum, record) => sum + Math.abs(record.milk_volume || 0), 0) / filteredRecords.length).toFixed(1) : '0'}L
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap px-6 font-bold">Batch ID</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Source Tank</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Date & Time</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Volume (L)</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Temperature (°C)</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Quality Grade</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Fat %</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Protein %</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Plate Count</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Acidity</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Destination</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Notes</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Record ID</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Created</TableHead>
              <TableHead className="whitespace-nowrap px-6 font-bold">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRecords.map(record => (
              <TableRow key={record.id}>
                <TableCell className="whitespace-nowrap px-6 min-w-[150px] font-mono text-xs bg-gray-50">
                  {record.batch_id || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px] font-medium">
                  {record.storage_tank || record.tank_number || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[180px]">
                  {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px] font-bold">
                  <span className={record.milk_volume < 0 ? 'text-red-600' : 'text-green-600'}>
                    {Math.abs(record.milk_volume || 0).toFixed(1)}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">
                  {record.temperature || 'N/A'}°C
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    record.quality_score === 'Grade A' ? 'bg-green-100 text-green-800' :
                    record.quality_score === 'Grade B' ? 'bg-yellow-100 text-yellow-800' :
                    record.quality_score === 'Grade C' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.quality_score || record.quality_check || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[80px]">
                  {record.fat_percentage ? `${record.fat_percentage}%` : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">
                  {record.protein_percentage ? `${record.protein_percentage}%` : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                  {record.total_plate_count || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">
                  {record.acidity || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px] font-medium">
                  {record.destination || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[200px]">
                  <div className="max-w-[200px] overflow-hidden text-ellipsis" title={record.notes}>
                    {record.notes || 'No notes'}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px] font-mono text-xs text-gray-500">
                  {record.id ? record.id.substring(0, 8) + '...' : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px] text-xs text-gray-500">
                  {format(new Date(record.created_at), 'MMM dd HH:mm')}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px] text-xs text-gray-500">
                  {record.updated_at ? format(new Date(record.updated_at), 'MMM dd HH:mm') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Show More/Less Button */}
      {filteredRecords.length > 5 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAllRecords(!showAllRecords)}
            className="flex items-center gap-2"
          >
            {showAllRecords ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less ({filteredRecords.length - 5} hidden)
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All ({filteredRecords.length - 5} more)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Additional Information Panel */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-medium text-gray-800 mb-2">Available Data Fields</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          {filteredRecords.length > 0 && Object.keys(filteredRecords[0]).map(key => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">{key.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
