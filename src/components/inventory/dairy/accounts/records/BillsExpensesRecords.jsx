
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileSpreadsheet, FileText, Download, RefreshCw, Search } from "lucide-react";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BillsExpensesRecords = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const { billsExpenses, loading, fetchBillsExpenses } = useBillsExpenses();

  useEffect(() => {
    fetchBillsExpenses();
  }, []);

  const handleRefresh = () => {
    fetchBillsExpenses();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case "hour":
        return new Date(now.setHours(now.getHours() - 1));
      case "day":
        return new Date(now.setDate(now.getDate() - 1));
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const filteredRecords = billsExpenses
    .filter(record => {
      // Status filter
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }

      // Time range filter
      if (timeRange !== "all") {
        const timeRangeDate = getTimeRangeDate();
        const recordDate = new Date(record.created_at);
        if (recordDate < timeRangeDate) {
          return false;
        }
      }

      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          record.bill_number?.toLowerCase().includes(searchLower) ||
          record.supplier_name?.toLowerCase().includes(searchLower) ||
          record.expense_type?.toLowerCase().includes(searchLower) ||
          record.expense_details?.toLowerCase().includes(searchLower) ||
          record.notes?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "date-desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "name-asc":
          return a.supplier_name.localeCompare(b.supplier_name);
        case "name-desc":
          return b.supplier_name.localeCompare(a.supplier_name);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Bill Number': record.bill_number,
        'Supplier': record.supplier_name,
        'Date': record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        'Due Date': record.due_date ? format(new Date(record.due_date), 'yyyy-MM-dd') : '',
        'Expense Type': record.expense_type,
        'Details': record.expense_details,
        'Amount': record.amount,
        'Currency': record.currency,
        'Payment Method': record.payment_method,
        'Status': record.status,
        'Recurring': record.is_recurring ? 'Yes' : 'No',
        'Notes': record.notes
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills & Expenses');
    XLSX.writeFile(workbook, 'bills-expenses.xlsx');
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRecords.map(record => ({
        'Bill Number': record.bill_number,
        'Supplier': record.supplier_name,
        'Date': record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        'Due Date': record.due_date ? format(new Date(record.due_date), 'yyyy-MM-dd') : '',
        'Expense Type': record.expense_type,
        'Details': record.expense_details,
        'Amount': record.amount,
        'Currency': record.currency,
        'Payment Method': record.payment_method,
        'Status': record.status,
        'Recurring': record.is_recurring ? 'Yes' : 'No',
        'Notes': record.notes
      }))
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bills-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Bills & Expenses Report', 14, 16);
    
    doc.autoTable({
      head: [['Bill Number', 'Supplier', 'Date', 'Amount', 'Status']],
      body: filteredRecords.map(record => [
        record.bill_number,
        record.supplier_name,
        record.bill_date ? format(new Date(record.bill_date), 'yyyy-MM-dd') : '',
        `${record.currency} ${record.amount}`,
        record.status
      ]),
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 0, 160],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    doc.save('bills-expenses.pdf');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount, currency = 'UGX') => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
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
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="flex items-center gap-1"
              title="Export to Excel"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-1"
              title="Export to CSV"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="flex items-center gap-1"
              title="Export to PDF"
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Records</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="hour">Last Hour</SelectItem>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (Highest)</SelectItem>
                <SelectItem value="amount-asc">Amount (Lowest)</SelectItem>
                <SelectItem value="name-asc">Supplier (A-Z)</SelectItem>
                <SelectItem value="name-desc">Supplier (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter}>
              {loading ? (
                <div className="text-center py-8">Loading records...</div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No records found. Try adjusting your filters.
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.bill_number}</TableCell>
                          <TableCell>{record.supplier_name}</TableCell>
                          <TableCell>{formatDate(record.bill_date)}</TableCell>
                          <TableCell>{formatDate(record.due_date)}</TableCell>
                          <TableCell>{record.expense_type}</TableCell>
                          <TableCell>{formatCurrency(record.amount, record.currency)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(record.status)}`}>
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesRecords;
