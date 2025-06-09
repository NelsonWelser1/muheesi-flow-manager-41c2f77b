
import React from 'react';
import { FileText } from "lucide-react";
import ExportButton from './ExportButton';
import * as XLSX from 'xlsx';

const CSVExportButton = ({ data, filename, disabled, onSuccess, onError }) => {
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      onError('No data available to export');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onSuccess('CSV file exported successfully');
    } catch (error) {
      onError(`Failed to export CSV: ${error.message}`);
    }
  };

  return (
    <ExportButton
      icon={FileText}
      label="Export as CSV"
      onClick={handleExportCSV}
      disabled={disabled}
    />
  );
};

export default CSVExportButton;
