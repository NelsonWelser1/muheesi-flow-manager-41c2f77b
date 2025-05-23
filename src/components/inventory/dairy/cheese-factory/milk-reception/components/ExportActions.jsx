
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const ExportActions = ({ records, onReportGenerated }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Milk Offload Records Report', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 30);

    const tableData = records.map(record => [
      record.batch_id || '',
      record.storage_tank,
      `-${Math.abs(record.volume_offloaded)}L`,
      `${record.temperature}°C`,
      `${record.fat_percentage}%`,
      `${record.protein_percentage}%`,
      format(new Date(record.created_at), 'dd/MM/yyyy HH:mm'),
      record.destination || 'N/A'
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Batch ID', 'Tank', 'Volume', 'Temp', 'Fat %', 'Protein %', 'Date & Time', 'Destination']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToExcel = () => {
    const excelData = records.map(record => ({
      'Batch ID': record.batch_id || '',
      'Storage Tank': record.storage_tank,
      'Volume (L)': `-${Math.abs(record.volume_offloaded)}`,
      'Temperature (°C)': record.temperature,
      'Fat (%)': record.fat_percentage,
      'Protein (%)': record.protein_percentage,
      'Date & Time': format(new Date(record.created_at), 'dd/MM/yyyy HH:mm'),
      'Destination': record.destination || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, `milk-offload-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const generateReport = () => {
    const reportData = {
      totalRecords: records.length,
      totalVolume: records.reduce((sum, record) => sum + Math.abs(record.volume_offloaded), 0),
      tanks: [...new Set(records.map(r => r.storage_tank))],
      destinations: [...new Set(records.map(r => r.destination).filter(Boolean))],
      averageTemperature: records.reduce((sum, record) => sum + record.temperature, 0) / records.length,
      averageFat: records.reduce((sum, record) => sum + record.fat_percentage, 0) / records.length,
      averageProtein: records.reduce((sum, record) => sum + record.protein_percentage, 0) / records.length,
      dateRange: {
        from: new Date(Math.min(...records.map(r => new Date(r.created_at)))),
        to: new Date(Math.max(...records.map(r => new Date(r.created_at))))
      }
    };
    onReportGenerated(reportData);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={exportToPDF} variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-1" />
        Export PDF
      </Button>
      <Button onClick={exportToExcel} variant="outline" size="sm">
        <File className="h-4 w-4 mr-1" />
        Export Excel
      </Button>
      <Button onClick={generateReport} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-1" />
        Generate Report
      </Button>
    </div>
  );
};
