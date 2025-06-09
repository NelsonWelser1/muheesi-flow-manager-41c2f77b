
import React from 'react';
import { FileText } from "lucide-react";
import ExportButton from './ExportButton';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFExportButton = ({ data, filename, disabled, onSuccess, onError }) => {
  const handleExportPDF = () => {
    if (!data || data.length === 0) {
      onError('No data available to export');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text('Export Data', 14, 16);
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers.map(header => item[header] || ''));
        
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 25,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [71, 85, 119] }
        });
      }
      
      doc.save(`${filename}.pdf`);
      onSuccess('PDF file exported successfully');
    } catch (error) {
      onError(`Failed to export PDF: ${error.message}`);
    }
  };

  return (
    <ExportButton
      icon={FileText}
      label="Export as PDF"
      onClick={handleExportPDF}
      disabled={disabled}
    />
  );
};

export default PDFExportButton;
