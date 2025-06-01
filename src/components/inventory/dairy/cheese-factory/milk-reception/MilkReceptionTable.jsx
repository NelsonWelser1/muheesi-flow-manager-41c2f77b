import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, RefreshCw, FileText, FileSpreadsheet, Download, Printer } from "lucide-react";
import { useMilkReception } from '@/hooks/useMilkReception';
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { exportToPDF, exportToExcel, exportToCSV } from '@/components/inventory/dairy/utils/reportExportUtils';
const RECORDS_PER_PAGE = 10;
const MilkReceptionTable = () => {
  const {
    data: records,
    isLoading,
    error,
    refetch
  } = useMilkReception();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    toast
  } = useToast();

  // Filter records based on search term
  const filteredRecords = records.filter(record => record.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) || record.tank_number?.toLowerCase().includes(searchTerm.toLowerCase()) || record.quality_score?.toLowerCase().includes(searchTerm.toLowerCase()) || record.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  const getQualityBadgeColor = quality => {
    switch (quality) {
      case 'Grade A':
        return 'bg-green-100 text-green-800';
      case 'Grade B':
        return 'bg-yellow-100 text-yellow-800';
      case 'Grade C':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Milk reception records have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  const handlePrint = () => {
    const printContent = document.getElementById('milk-reception-table');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      const printableContent = `
        <html>
          <head>
            <title>Milk Reception Records</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; margin-bottom: 20px; }
              .header { margin-bottom: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Milk Reception Records</h1>
              <p>Generated on: ${format(new Date(), 'PPP')}</p>
              <p>Total Records: ${filteredRecords.length}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printableContent);
      printWindow.document.close();
      printWindow.print();
    }
  };
  const handleExportPDF = () => {
    try {
      exportToPDF(filteredRecords, 'Milk Reception Records', 'milk_reception');
      toast({
        title: "Export Successful",
        description: "PDF file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleExportExcel = () => {
    try {
      exportToExcel(filteredRecords, 'Milk Reception Records', 'milk_reception');
      toast({
        title: "Export Successful",
        description: "Excel file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export Excel. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleExportCSV = () => {
    try {
      exportToCSV(filteredRecords, 'Milk Reception Records', 'milk_reception');
      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (isLoading) {
    return <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading milk reception records...</div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading records: {error.message}
          </div>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle>Milk Reception Records</CardTitle>
        <div className="flex items-center justify-between space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by supplier, tank, quality, or batch ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-1">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecords.length === 0 ? <div className="text-center py-6 text-muted-foreground">
            {searchTerm ? 'No records found matching your search.' : 'No milk reception records found.'}
          </div> : <>
            <div className="overflow-x-auto" id="milk-reception-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Supplier</TableHead>
                    <TableHead className="whitespace-nowrap">Volume (L)</TableHead>
                    <TableHead className="whitespace-nowrap">Tank</TableHead>
                    <TableHead className="whitespace-nowrap">Temperature (°C)</TableHead>
                    <TableHead className="whitespace-nowrap">Fat %</TableHead>
                    <TableHead className="whitespace-nowrap">Protein %</TableHead>
                    <TableHead className="whitespace-nowrap">Quality</TableHead>
                    <TableHead className="whitespace-nowrap">Batch ID</TableHead>
                    <TableHead className="whitespace-nowrap">Destination</TableHead>
                    <TableHead className="whitespace-nowrap">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.map(record => <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {record.supplier_name}
                      </TableCell>
                      <TableCell className={`whitespace-nowrap ${record.milk_volume < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {record.milk_volume}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{record.tank_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{record.temperature}</TableCell>
                      <TableCell className="whitespace-nowrap">{record.fat_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap">{record.protein_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={getQualityBadgeColor(record.quality_score)}>
                          {record.quality_score}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono whitespace-nowrap">
                        {record.batch_id || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{record.destination || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                        {record.notes}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
              </div>
              
              {totalPages > 1 && <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                    
                    {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                        <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">
                          {page}
                        </PaginationLink>
                      </PaginationItem>)}
                    
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>}
            </div>
          </>}
      </CardContent>
    </Card>;
};
export default MilkReceptionTable;