
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import RecruitmentExportActions from '../RecruitmentExportActions';

const RecordsHeader = ({ records }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('recruitment-records-table');
    if (!printContent) {
      console.warn('Print content not found');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Recruitment Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; white-space: nowrap; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .print-date { text-align: right; font-size: 12px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <div class="header">
            <h2>Recruitment Records Report</h2>
            <p>Total Records: ${records?.length || 0}</p>
          </div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Recruitment Records</CardTitle>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <RecruitmentExportActions 
          records={records} 
          fileName="recruitment_records" 
        />
      </div>
    </CardHeader>
  );
};

export default RecordsHeader;
