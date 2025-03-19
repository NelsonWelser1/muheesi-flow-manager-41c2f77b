
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import ExcelExportButton from './export-buttons/ExcelExportButton';
import CSVExportButton from './export-buttons/CSVExportButton';
import PDFExportButton from './export-buttons/PDFExportButton';
import { exportToExcel, exportToCSV, exportToPDF } from './utils/exportUtils';

const ExportActions = ({ filteredRecords }) => {
  const { toast } = useToast();

  const handleExcelExport = () => {
    exportToExcel(filteredRecords, toast);
  };

  const handleCSVExport = () => {
    exportToCSV(filteredRecords, toast);
  };

  const handlePDFExport = () => {
    exportToPDF(filteredRecords, toast);
  };
  
  return (
    <div className="flex items-center gap-1">
      <ExcelExportButton onClick={handleExcelExport} />
      <CSVExportButton onClick={handleCSVExport} />
      <PDFExportButton onClick={handlePDFExport} />
    </div>
  );
};

export default ExportActions;
