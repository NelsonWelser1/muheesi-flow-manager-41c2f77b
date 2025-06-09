
import React from 'react';
import { FileSpreadsheet } from "lucide-react";
import ExportButton from './ExportButton';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ data, filename, disabled, onSuccess, onError }) => {
  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      onError('No data available to export');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      onSuccess('Excel file exported successfully');
    } catch (error) {
      onError(`Failed to export Excel: ${error.message}`);
    }
  };

  return (
    <ExportButton
      icon={FileSpreadsheet}
      label="Export as Excel"
      onClick={handleExportExcel}
      disabled={disabled}
    />
  );
};

export default ExcelExportButton;
