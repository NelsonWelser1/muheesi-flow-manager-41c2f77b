
import React, { useState, useEffect, useRef } from 'react';
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RefreshCw, 
  FileDown, 
  Search, 
  FileText, 
  Printer, 
  FileSpreadsheet,
  ArrowLeft
} from "lucide-react";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillsExpensesRecords = ({ onBack }) => {
  const { billsExpenses, loading, fetchBillsExpenses } = useBillsExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { toast } = useToast();
  const printRef = useRef(null);

  useEffect(() => {
    fetchBillsExpenses();
  }, []);

  // Filter records based on search, time range, and tab
  const filterRecords = () => {
    let filtered = [...billsExpenses];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.supplier_name?.toLowerCase().includes(term) || 
        record.bill_number?.toLowerCase().includes(term) ||
        record.expense_type?.toLowerCase().includes(term)
      );
    }
    
    // Apply time range filter
    const now = new Date();
    if (timeRange === 'day') {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(record => record.created_at >= dayAgo);
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(record => record.created_at >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(record => record.created_at >= monthAgo);
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(record => record.created_at >= yearAgo);
    }
    
    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(record => record.status === selectedTab);
    }
    
    return filtered;
  };

  const exportToExcel = () => {
    try {
      const filteredData = filterRecords();
      
      if (filteredData.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records matching your current filters.",
          variant: "destructive"
        });
        return;
      }
      
      // Format data for Excel
      const formattedData = filteredData.map(record => ({
        'Bill Number': record.bill_number,
        'Supplier': record.supplier_name,
        'Date': formatDate(record.bill_date),
        'Due Date': formatDate(record.due_date),
        'Expense Type': record.expense_type,
        'Amount': `${record.currency} ${parseFloat(record.amount).toLocaleString()}`,
        'Status': record.status,
        'Payment Method': record.payment_method,
        'Is Recurring': record.is_recurring ? 'Yes' : 'No',
        'Notes': record.notes
      }));
      
      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bills & Expenses');
      
      // Generate Excel file
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      XLSX.writeFile(wb, `bills-expenses-${timestamp}.xlsx`);
      
      toast({
        title: "Success",
        description: "Data exported to Excel successfully",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export data to Excel",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = () => {
    try {
      const filteredData = filterRecords();
      
      if (filteredData.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records matching your current filters.",
          variant: "destructive"
        });
        return;
      }
      
      // Initialize PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Bills & Expenses Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
      
      // Prepare table data
      const tableData = filteredData.map(record => [
        record.bill_number,
        record.supplier_name,
        formatDate(record.bill_date),
        record.expense_type,
        `${record.currency} ${parseFloat(record.amount).toLocaleString()}`,
        record.status,
      ]);
      
      // Add table
      doc.autoTable({
        startY: 35,
        head: [['Bill #', 'Supplier', 'Date', 'Type', 'Amount', 'Status']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 0, 160] },
      });
      
      // Save PDF
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      doc.save(`bills-expenses-${timestamp}.pdf`);
      
      toast({
        title: "Success",
        description: "Data exported to PDF successfully",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export data to PDF",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    try {
      const filteredData = filterRecords();
      
      if (filteredData.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records matching your current filters.",
          variant: "destructive"
        });
        return;
      }
      
      // Prepare headers
      let csv = 'Bill Number,Supplier,Date,Due Date,Expense Type,Amount,Status,Payment Method,Is Recurring,Notes\n';
      
      // Add data
      filteredData.forEach(record => {
        const row = [
          record.bill_number,
          `"${record.supplier_name || ''}"`,
          formatDate(record.bill_date),
          formatDate(record.due_date),
          `"${record.expense_type || ''}"`,
          `${record.currency} ${parseFloat(record.amount).toLocaleString()}`,
          record.status,
          record.payment_method,
          record.is_recurring ? 'Yes' : 'No',
          `"${record.notes || ''}"`
        ].join(',');
        csv += row + '\n';
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      link.setAttribute('href', url);
      link.setAttribute('download', `bills-expenses-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Data exported to CSV successfully",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export data to CSV",
        variant: "destructive"
      });
    }
  };

  const printRecords = () => {
    try {
      window.print();
      
      toast({
        title: "Success",
        description: "Print dialog opened",
      });
    } catch (error) {
      console.error('Error printing records:', error);
      toast({
        title: "Error",
        description: "Failed to open print dialog",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Partially Paid</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  const filteredRecords = filterRecords();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchBillsExpenses} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <div className="dropdown relative group">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <div className="dropdown-menu absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 py-1 hidden group-hover:block z-10">
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-sm" 
                onClick={exportToExcel}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-sm" 
                onClick={exportToPDF}
              >
                <FileText className="h-4 w-4 mr-2" /> PDF
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-sm" 
                onClick={exportToCSV}
              >
                <FileText className="h-4 w-4 mr-2" /> CSV
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-sm" 
                onClick={printRecords}
              >
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 md:w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partially Paid</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <RecordsTable 
                records={filteredRecords} 
                loading={loading} 
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <RecordsTable 
                records={filteredRecords} 
                loading={loading} 
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="partial" className="mt-0">
              <RecordsTable 
                records={filteredRecords} 
                loading={loading} 
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="paid" className="mt-0">
              <RecordsTable 
                records={filteredRecords} 
                loading={loading} 
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Hidden print content */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1 className="text-2xl font-bold mb-4">Bills & Expenses Report</h1>
        <p className="mb-4">Generated on: {format(new Date(), 'PPP')}</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Bill #</th>
              <th className="border p-2 text-left">Supplier</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.bill_number}</td>
                <td className="border p-2">{record.supplier_name}</td>
                <td className="border p-2">{formatDate(record.bill_date)}</td>
                <td className="border p-2">{record.expense_type}</td>
                <td className="border p-2">{record.currency} {parseFloat(record.amount).toLocaleString()}</td>
                <td className="border p-2">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Separate Records Table component
const RecordsTable = ({ records, loading, formatDate, getStatusBadge }) => {
  if (loading) {
    return <div className="text-center py-8">Loading records...</div>;
  }

  if (records.length === 0) {
    return <div className="text-center py-8">No records found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="p-3 text-sm">{record.bill_number}</td>
              <td className="p-3 text-sm">{record.supplier_name}</td>
              <td className="p-3 text-sm">{formatDate(record.bill_date)}</td>
              <td className="p-3 text-sm">{formatDate(record.due_date)}</td>
              <td className="p-3 text-sm">{record.expense_type}</td>
              <td className="p-3 text-sm">{record.currency} {parseFloat(record.amount).toLocaleString()}</td>
              <td className="p-3 text-sm">{getStatusBadge(record.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillsExpensesRecords;
