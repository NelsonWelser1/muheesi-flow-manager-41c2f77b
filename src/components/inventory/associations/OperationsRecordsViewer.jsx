
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { 
  ArrowLeft, 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  Loader2, 
  Calendar, 
  Filter 
} from "lucide-react";
import { useAssociationOperations } from '@/hooks/useAssociationOperations';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const OperationsRecordsViewer = ({ onBack, isKazo, associationId }) => {
  const { toast } = useToast();
  const {
    operations,
    loading,
    error,
    timeRange,
    statusFilter,
    searchTerm,
    setTimeRange,
    setStatusFilter,
    setSearchTerm,
    fetchAllOperations
  } = useAssociationOperations(associationId);

  // For export functionality
  const [exportLoading, setExportLoading] = useState(false);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Refresh data
  const handleRefresh = async () => {
    await fetchAllOperations({
      status: statusFilter,
      timeRange: timeRange,
      searchTerm: searchTerm
    });
    
    toast({
      title: "Refreshed",
      description: "Operations records have been refreshed.",
      duration: 2000
    });
  };

  // Export to Excel
  const handleExportToExcel = () => {
    setExportLoading(true);
    
    try {
      const formattedData = operations.map(op => ({
        'Association Name': op.associations?.association_name || 'N/A',
        'Next Meeting Date': op.next_meeting_date ? format(parseISO(op.next_meeting_date), 'PPP') : 'N/A',
        'Training Schedule': op.training_schedule ? format(parseISO(op.training_schedule), 'PPP') : 'N/A',
        'Collective Resources': op.collective_resources || 'N/A',
        'Shared Equipment': op.shared_equipment || 'N/A',
        'Status': op.status || 'N/A',
        'Created At': op.created_at ? format(parseISO(op.created_at), 'PPP') : 'N/A'
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Operations');
      
      XLSX.writeFile(workbook, 'operations_records.xlsx');
      
      toast({
        title: "Export Successful",
        description: "Operations records exported to Excel.",
        duration: 3000,
        className: "bg-green-50 border-green-300 text-green-800"
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export operations records.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Export to PDF
  const handleExportToPDF = () => {
    setExportLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Association Operations Records', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 22);
      
      // Format data for PDF table
      const tableData = operations.map(op => [
        op.associations?.association_name || 'N/A',
        op.next_meeting_date ? format(parseISO(op.next_meeting_date), 'P') : 'N/A',
        op.training_schedule ? format(parseISO(op.training_schedule), 'P') : 'N/A',
        op.collective_resources || 'N/A',
        op.shared_equipment || 'N/A',
        op.status || 'N/A'
      ]);
      
      // Create PDF table
      doc.autoTable({
        startY: 25,
        head: [['Association', 'Meeting Date', 'Training Date', 'Resources', 'Equipment', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] }
      });
      
      doc.save('operations_records.pdf');
      
      toast({
        title: "Export Successful",
        description: "Operations records exported to PDF.",
        duration: 3000,
        className: "bg-green-50 border-green-300 text-green-800"
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export operations records.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Export to CSV
  const handleExportToCSV = () => {
    setExportLoading(true);
    
    try {
      const formattedData = operations.map(op => ({
        'Association Name': op.associations?.association_name || 'N/A',
        'Next Meeting Date': op.next_meeting_date ? format(parseISO(op.next_meeting_date), 'PPP') : 'N/A',
        'Training Schedule': op.training_schedule ? format(parseISO(op.training_schedule), 'PPP') : 'N/A',
        'Collective Resources': op.collective_resources || 'N/A',
        'Shared Equipment': op.shared_equipment || 'N/A',
        'Status': op.status || 'N/A',
        'Created At': op.created_at ? format(parseISO(op.created_at), 'PPP') : 'N/A'
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'operations_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Operations records exported to CSV.",
        duration: 3000,
        className: "bg-green-50 border-green-300 text-green-800"
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export operations records.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Status badge color mapping
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'postponed':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Operations Form
        </Button>
        <h3 className="text-xl font-semibold">Operations Records</h3>
      </div>

      <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="postponed">Postponed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search operations..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Time Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="day">Last Day</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportToExcel} 
                  className="text-xs"
                  disabled={exportLoading || operations.length === 0}
                >
                  <FileSpreadsheet className="mr-1 h-4 w-4" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportToPDF} 
                  className="text-xs"
                  disabled={exportLoading || operations.length === 0}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportToCSV} 
                  className="text-xs"
                  disabled={exportLoading || operations.length === 0}
                >
                  <Download className="mr-1 h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value={statusFilter} className="mt-0">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading operations...</span>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center py-8 text-destructive">
                    <span>Error: {error}</span>
                  </div>
                ) : operations.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No operations found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {searchTerm 
                        ? "Try adjusting your search or filters" 
                        : "Start by adding operations to this association"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Association</TableHead>
                          <TableHead>Next Meeting</TableHead>
                          <TableHead>Training Schedule</TableHead>
                          <TableHead>Collective Resources</TableHead>
                          <TableHead>Shared Equipment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {operations.map((operation) => (
                          <TableRow key={operation.id}>
                            <TableCell className="font-medium">
                              {operation.associations?.association_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {operation.next_meeting_date 
                                ? format(parseISO(operation.next_meeting_date), "PPP") 
                                : "Not set"}
                            </TableCell>
                            <TableCell>
                              {operation.training_schedule 
                                ? format(parseISO(operation.training_schedule), "PPP") 
                                : "Not set"}
                            </TableCell>
                            <TableCell>
                              {operation.collective_resources || "None"}
                            </TableCell>
                            <TableCell>
                              {operation.shared_equipment || "None"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(operation.status)}>
                                {operation.status || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {operation.created_at 
                                ? format(parseISO(operation.created_at), "PPP") 
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default OperationsRecordsViewer;
