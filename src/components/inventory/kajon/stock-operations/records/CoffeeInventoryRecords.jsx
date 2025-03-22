
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useKAJONCoffees } from '@/integrations/supabase/hooks/useKAJONCoffee';
import { format } from 'date-fns';
import StatusTabs from '@/components/inventory/dairy/accounts/records/components/StatusTabs';
import SearchFilters from '@/components/inventory/dairy/accounts/records/components/SearchFilters';
import { useRecordsFilter } from '@/components/inventory/dairy/accounts/records/hooks/useRecordsFilter';
import CSVExportButton from '@/components/inventory/dairy/logistics/records/components/export-buttons/CSVExportButton';
import ExcelExportButton from '@/components/inventory/dairy/logistics/records/components/export-buttons/ExcelExportButton';
import PDFExportButton from '@/components/inventory/dairy/logistics/records/components/export-buttons/PDFExportButton';

const CoffeeInventoryRecords = ({ onBack, isKazo }) => {
  const { toast } = useToast();
  const { data: allCoffeeInventory, isLoading, refetch } = useKAJONCoffees();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format data for filtering
  const formattedRecords = React.useMemo(() => {
    return allCoffeeInventory?.map(item => ({
      ...item,
      id: item.id,
      status: item.status || 'active',
      created_at: item.created_at,
      date: item.created_at,
      amount: (item.buying_price || 0) * (item.quantity || 0),
      supplier_name: item.source,
      expense_type: item.coffeeType,
      bill_number: `INV-${item.id.slice(0, 6)}`,
      bill_date: item.created_at,
      due_date: null
    })) || [];
  }, [allCoffeeInventory]);

  // Use filter hook
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    timeRange,
    setTimeRange,
    sortBy,
    setSortBy,
    filteredRecords
  } = useRecordsFilter(formattedRecords);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle export functions
  const handleExportCSV = () => {
    try {
      // Simplified CSV export implementation
      const headers = ["Date", "Location", "Type", "Grade", "Source", "Quantity", "Unit", "Price", "Total"];
      const csvData = filteredRecords.map(record => [
        format(new Date(record.created_at), 'yyyy-MM-dd'),
        record.location,
        record.coffeeType,
        record.qualityGrade,
        record.source,
        record.quantity,
        record.unit,
        record.buying_price,
        record.amount
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `coffee-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Records exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Error",
        description: "Failed to export records to CSV",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    toast({
      title: "Information",
      description: "Excel export not implemented yet"
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Information",
      description: "PDF export not implemented yet"
    });
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "Records refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh records",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="h-9 w-9 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Coffee Inventory Records</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <div className="flex items-center gap-2">
            <CSVExportButton onClick={handleExportCSV} disabled={isLoading || filteredRecords.length === 0} />
            <ExcelExportButton onClick={handleExportExcel} disabled={isLoading || filteredRecords.length === 0} />
            <PDFExportButton onClick={handleExportPDF} disabled={isLoading || filteredRecords.length === 0} />
          </div>
        </div>
      </div>

      <StatusTabs 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        filteredRecords={paginatedRecords} 
        loading={isLoading}
      />

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {!isLoading && paginatedRecords.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Coffee Type</TableHead>
                <TableHead>Quality Grade</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Buying Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{record.coffeeType}</TableCell>
                  <TableCell>{record.qualityGrade}</TableCell>
                  <TableCell>{record.source}</TableCell>
                  <TableCell>{record.quantity} {record.unit}</TableCell>
                  <TableCell>{new Intl.NumberFormat('en-UG', { style: 'currency', currency: record.currency }).format(record.buying_price)}</TableCell>
                  <TableCell>{new Intl.NumberFormat('en-UG', { style: 'currency', currency: record.currency }).format(record.amount)}</TableCell>
                  <TableCell>{record.manager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && paginatedRecords.length === 0 && (
        <div className="text-center py-10 border rounded-md">
          <p className="text-gray-500">No records found. Try adjusting your filters.</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-10 border rounded-md">
          <p className="text-gray-500">Loading records...</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && <PaginationItem><span className="px-2">...</span></PaginationItem>}
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationLink 
                  isActive={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CoffeeInventoryRecords;
