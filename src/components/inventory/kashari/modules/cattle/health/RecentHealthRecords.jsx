
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, RefreshCw } from "lucide-react";
import AddHealthRecordDialog from './AddHealthRecordDialog';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { generateAndDownloadPDF } from "@/utils/exports/pdfExportUtils";
import { exportToExcel } from "@/utils/exports/reportExportUtils";

const RecentHealthRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { healthRecords, isLoading, error, refetch } = useHealthRecords();

  const filteredRecords = healthRecords?.filter(
    (record) => 
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.record_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.cattle_inventory?.tag_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePDFExport = () => {
    const formattedData = filteredRecords.map(record => ({
      "Date": new Date(record.record_date).toLocaleDateString(),
      "Cattle": `${record.cattle_inventory?.tag_number} - ${record.cattle_inventory?.name || 'Unnamed'}`,
      "Type": record.record_type,
      "Description": record.description,
      "Treatment": record.treatment || 'N/A',
      "Administered By": record.administered_by || 'N/A',
      "Next Due": record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'
    }));
    
    generateAndDownloadPDF(formattedData, "health_records", "Recent Health Records");
  };

  const handleExcelExport = () => {
    exportToExcel(filteredRecords, "health_records");
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold">Recent Health Records</h3>
          <AddHealthRecordDialog />
        </div>

        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <Input
            type="search"
            placeholder="Search records..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refetch}
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePDFExport}
              title="Export as PDF"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExcelExport}
              title="Export as Excel"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Cattle</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2 hidden sm:table-cell">Description</th>
                <th className="text-left py-2 hidden lg:table-cell">Administered By</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Loading records...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-red-500">Error loading records</td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No health records found</td>
                </tr>
              ) : (
                filteredRecords.slice(0, 5).map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="py-2">{new Date(record.record_date).toLocaleDateString()}</td>
                    <td className="py-2">{record.cattle_inventory?.tag_number}</td>
                    <td className="py-2 capitalize">{record.record_type}</td>
                    <td className="py-2 hidden sm:table-cell">{record.description}</td>
                    <td className="py-2 hidden lg:table-cell">{record.administered_by || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default RecentHealthRecords;
