
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/coffee/coffeeExport";

const CommunicationExportActions = ({ messages, selectedMessage = null }) => {
  const formatMessages = (messagesToFormat) => {
    return messagesToFormat.map(message => ({
      'Subject': message.subject || '',
      'Type': message.type?.toUpperCase() || '',
      'Recipients': message.recipients || '',
      'Message': message.message || '',
      'Status': message.status?.charAt(0).toUpperCase() + message.status?.slice(1) || '',
      'Sent Date': message.sentDate ? new Date(message.sentDate).toLocaleDateString() : 'N/A',
      'Sent By': message.sentBy || 'N/A'
    }));
  };

  const handleExportCSV = () => {
    const dataToExport = selectedMessage ? [selectedMessage] : messages;
    exportToCSV(formatMessages(dataToExport), 'communication-messages');
  };

  const handleExportExcel = () => {
    const dataToExport = selectedMessage ? [selectedMessage] : messages;
    exportToExcel(formatMessages(dataToExport), 'communication-messages');
  };

  const handleExportPDF = () => {
    const dataToExport = selectedMessage ? [selectedMessage] : messages;
    exportToPDF(
      formatMessages(dataToExport), 
      'communication-messages', 
      selectedMessage ? 'Communication Message Details' : 'Communication Messages List'
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        className="flex items-center gap-1"
        title="Export to CSV"
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="flex items-center gap-1"
        title="Export to Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="flex items-center gap-1"
        title="Export to PDF"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default CommunicationExportActions;
