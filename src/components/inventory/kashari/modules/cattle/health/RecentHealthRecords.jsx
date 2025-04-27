
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, FileSpreadsheet, RefreshCw, Eye } from "lucide-react";
import AddHealthRecordDialog from './AddHealthRecordDialog';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { generateAndDownloadPDF } from "@/utils/exports/pdfExportUtils";
import { exportToExcel, exportToCSV } from "@/utils/exports/reportExportUtils";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const RecentHealthRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const { healthRecords, isLoading, error, refetch } = useHealthRecords();

  console.log("Health records in RecentHealthRecords:", healthRecords);

  const filteredRecords = healthRecords?.filter(
    (record) => 
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.record_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.cattle_inventory?.tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.cattle_inventory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePDFExport = () => {
    const formattedData = filteredRecords.map(record => ({
      "Date": new Date(record.record_date).toLocaleDateString(),
      "Cattle": `${record.cattle_inventory?.tag_number || 'N/A'} - ${record.cattle_inventory?.name || 'Unnamed'}`,
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
  
  const handleCSVExport = () => {
    exportToCSV(filteredRecords, "health_records");
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold">Recent Health Records</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setViewAllOpen(true)}
            >
              <Eye className="h-4 w-4" />
              View All
            </Button>
            <AddHealthRecordDialog />
          </div>
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
              disabled={filteredRecords.length === 0}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExcelExport}
              title="Export as Excel"
              disabled={filteredRecords.length === 0}
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
                    <td className="py-2">{record.cattle_inventory?.tag_number || 'N/A'}</td>
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

      {/* View All Dialog */}
      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Health Records</DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cattle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Administered By</TableHead>
                  <TableHead>Next Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">Loading records...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-red-500">Error loading records</TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">No health records found</TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell>{new Date(record.record_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {record.cattle_inventory?.tag_number || 'N/A'} - {record.cattle_inventory?.name || 'Unnamed'}
                      </TableCell>
                      <TableCell className="capitalize">{record.record_type}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.treatment || 'N/A'}</TableCell>
                      <TableCell>{record.administered_by || 'N/A'}</TableCell>
                      <TableCell>{record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePDFExport} disabled={filteredRecords.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExcelExport} disabled={filteredRecords.length === 0}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RecentHealthRecords;
