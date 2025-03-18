
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DownloadCloud, 
  Search, 
  FileSpreadsheet, 
  FilePdf, 
  RefreshCw,
  Eye
} from "lucide-react";
import { usePaymentsReceipts } from "@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts";
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

const PaymentsReceiptsRecords = ({ setActiveView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { payments, fetchPaymentsReceipts } = usePaymentsReceipts();
  const { toast } = useToast();
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchPaymentsReceipts();
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Could not load payment records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter records based on search term, status, and time range
  const filteredRecords = React.useMemo(() => {
    let filtered = [...payments];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.payment_number?.toLowerCase().includes(term) ||
        record.party_name?.toLowerCase().includes(term) ||
        record.payment_method?.toLowerCase().includes(term) ||
        String(record.amount).includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'this-week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'this-month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'this-year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.payment_date);
          return recordDate >= startDate && recordDate <= now;
        });
      }
    }
    
    // Sort records
    filtered.sort((a, b) => {
      const dateA = new Date(a.payment_date);
      const dateB = new Date(b.payment_date);
      
      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return dateB - dateA;
      }
    });
    
    return filtered;
  }, [payments, searchTerm, statusFilter, timeRange, sortBy]);
  
  // Export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Convert the data to the format needed for Excel
    const data = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Type': record.payment_type === 'received' ? 'Received' : 'Issued',
      'Party Name': record.party_name,
      'Date': format(new Date(record.payment_date), 'dd/MM/yyyy'),
      'Amount': record.amount,
      'Currency': record.currency,
      'Method': record.payment_method,
      'Reference': record.reference_number || '',
      'Status': record.status,
      'Notes': record.notes || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments_Receipts');
    XLSX.writeFile(workbook, 'Payments_Receipts_Report.xlsx');
    
    toast({
      title: "Excel Export",
      description: "Data exported successfully to Excel",
    });
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredRecords.map(record => ({
      'Payment Number': record.payment_number,
      'Type': record.payment_type === 'received' ? 'Received' : 'Issued',
      'Party Name': record.party_name,
      'Date': format(new Date(record.payment_date), 'dd/MM/yyyy'),
      'Amount': record.amount,
      'Currency': record.currency,
      'Method': record.payment_method,
      'Reference': record.reference_number || '',
      'Status': record.status,
      'Notes': record.notes || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create a blob and download
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'Payments_Receipts_Report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Export",
      description: "Data exported successfully to CSV",
    });
  };
  
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add a title
    doc.setFontSize(18);
    doc.text('Payments & Receipts Report', 14, 22);
    
    // Add a subtitle with the current date
    doc.setFontSize(11);
    doc.text(`Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
    
    // Create the table
    const tableColumn = [
      'Payment #', 
      'Type', 
      'Party', 
      'Date', 
      'Amount', 
      'Method', 
      'Status'
    ];
    
    const tableRows = filteredRecords.map(record => [
      record.payment_number,
      record.payment_type === 'received' ? 'Received' : 'Issued',
      record.party_name,
      format(new Date(record.payment_date), 'dd/MM/yyyy'),
      `${record.amount} ${record.currency}`,
      record.payment_method,
      record.status
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [0, 0, 160] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    });
    
    doc.save('Payments_Receipts_Report.pdf');
    
    toast({
      title: "PDF Export",
      description: "Data exported successfully to PDF",
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-[#f8fafc]">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle>Payments & Receipts Records</CardTitle>
            <CardDescription className="mt-1">
              View and manage all payment and receipt records
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <div className="relative group">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <DownloadCloud className="h-4 w-4" />
                Export
              </Button>
              <div className="absolute right-0 mt-2 w-40 hidden group-hover:block z-10">
                <div className="bg-white shadow-md rounded-md overflow-hidden border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start px-3 py-2 flex items-center gap-2"
                    onClick={exportToExcel}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start px-3 py-2 flex items-center gap-2"
                    onClick={exportToCSV}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start px-3 py-2 flex items-center gap-2"
                    onClick={exportToPDF}
                  >
                    <FilePdf className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-4 px-4 bg-gray-50 rounded-md">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Time Range</label>
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Sort By</label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort records" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="all">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="issued">Issued</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Payment #</th>
                      <th className="border px-4 py-2 text-left">Type</th>
                      <th className="border px-4 py-2 text-left">Party Name</th>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-right">Amount</th>
                      <th className="border px-4 py-2 text-left">Method</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{record.payment_number}</td>
                          <td className="border px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              record.payment_type === 'received' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {record.payment_type === 'received' ? 'Received' : 'Issued'}
                            </span>
                          </td>
                          <td className="border px-4 py-2">{record.party_name}</td>
                          <td className="border px-4 py-2">
                            {format(new Date(record.payment_date), 'dd/MM/yyyy')}
                          </td>
                          <td className="border px-4 py-2 text-right">
                            {record.amount.toLocaleString()} {record.currency}
                          </td>
                          <td className="border px-4 py-2 capitalize">
                            {record.payment_method.replace('_', ' ')}
                          </td>
                          <td className="border px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              record.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : record.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="border px-4 py-8 text-center text-gray-500">
                          {isLoading 
                            ? 'Loading records...' 
                            : 'No payment or receipt records found'
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="received" className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Receipt #</th>
                      <th className="border px-4 py-2 text-left">Payer Name</th>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-right">Amount</th>
                      <th className="border px-4 py-2 text-left">Method</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.filter(r => r.payment_type === 'received').length > 0 ? (
                      filteredRecords
                        .filter(r => r.payment_type === 'received')
                        .map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{record.payment_number}</td>
                            <td className="border px-4 py-2">{record.party_name}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(record.payment_date), 'dd/MM/yyyy')}
                            </td>
                            <td className="border px-4 py-2 text-right">
                              {record.amount.toLocaleString()} {record.currency}
                            </td>
                            <td className="border px-4 py-2 capitalize">
                              {record.payment_method.replace('_', ' ')}
                            </td>
                            <td className="border px-4 py-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                record.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : record.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="border px-4 py-8 text-center text-gray-500">
                          No receipt records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="issued" className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Payment #</th>
                      <th className="border px-4 py-2 text-left">Payee Name</th>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-right">Amount</th>
                      <th className="border px-4 py-2 text-left">Method</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.filter(r => r.payment_type === 'issued').length > 0 ? (
                      filteredRecords
                        .filter(r => r.payment_type === 'issued')
                        .map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{record.payment_number}</td>
                            <td className="border px-4 py-2">{record.party_name}</td>
                            <td className="border px-4 py-2">
                              {format(new Date(record.payment_date), 'dd/MM/yyyy')}
                            </td>
                            <td className="border px-4 py-2 text-right">
                              {record.amount.toLocaleString()} {record.currency}
                            </td>
                            <td className="border px-4 py-2 capitalize">
                              {record.payment_method.replace('_', ' ')}
                            </td>
                            <td className="border px-4 py-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                record.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : record.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="border px-4 py-2 text-center">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="border px-4 py-8 text-center text-gray-500">
                          No payment records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsReceiptsRecords;
