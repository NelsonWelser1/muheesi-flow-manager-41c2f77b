import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, FileText, FileSpreadsheet, Printer, X, Calendar, Clock } from 'lucide-react';
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SalesOrderList = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const { salesOrders, isLoading, error, fetchSalesOrders } = useSalesOrders();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchSalesOrders();
    }
  }, [isOpen, fetchSalesOrders]);

  // Filter and sort orders based on search term, date, time, and sort criteria
  const getFilteredAndSortedOrders = () => {
    let filtered = salesOrders.filter(order =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sales_rep?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply date filters
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.order_date);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate.toDateString() === yesterday.toDateString();
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Apply time filters
    if (timeFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at || order.order_date);
        const orderHour = orderDate.getHours();
        const currentHour = now.getHours();
        
        switch (timeFilter) {
          case 'hour':
            return Math.abs(orderDate - now) <= 60 * 60 * 1000; // Last hour
          case 'morning':
            return orderHour >= 6 && orderHour < 12;
          case 'afternoon':
            return orderHour >= 12 && orderHour < 18;
          case 'evening':
            return orderHour >= 18 && orderHour < 24;
          case 'night':
            return orderHour >= 0 && orderHour < 6;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.order_date) - new Date(a.order_date);
        case 'date-asc':
          return new Date(a.order_date) - new Date(b.order_date);
        case 'amount-desc':
          return (b.quantity * b.unit_price) - (a.quantity * a.unit_price);
        case 'amount-asc':
          return (a.quantity * a.unit_price) - (b.quantity * b.unit_price);
        case 'customer-asc':
          return (a.customer_name || '').localeCompare(b.customer_name || '');
        case 'customer-desc':
          return (b.customer_name || '').localeCompare(a.customer_name || '');
        default:
          return 0;
      }
    });
  };

  const filteredOrders = getFilteredAndSortedOrders();

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'paid': { color: 'bg-green-100 text-green-800', label: 'Paid' },
      'overdue': { color: 'bg-red-100 text-red-800', label: 'Overdue' },
      'cancelled': { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Order Date', 'Customer', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Payment Status', 'Sales Rep'];
    const csvData = filteredOrders.map(order => [
      formatDate(order.order_date),
      order.customer_name || '',
      order.product || '',
      order.product_type || '',
      order.quantity || 0,
      order.unit_price || 0,
      (order.quantity * order.unit_price) || 0,
      order.payment_status || '',
      order.sales_rep || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Sales orders exported to CSV file",
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Order Date', 'Customer', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Payment Status', 'Sales Rep'],
      ...filteredOrders.map(order => [
        formatDate(order.order_date),
        order.customer_name || '',
        order.product || '',
        order.product_type || '',
        order.quantity || 0,
        order.unit_price || 0,
        (order.quantity * order.unit_price) || 0,
        order.payment_status || '',
        order.sales_rep || ''
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Orders');
    XLSX.writeFile(workbook, `sales_orders_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export Successful",
      description: "Sales orders exported to Excel file",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Orders Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredOrders.map(order => [
      formatDate(order.order_date),
      order.customer_name || '',
      order.product || '',
      order.product_type || '',
      order.quantity || 0,
      formatCurrency(order.unit_price || 0),
      formatCurrency((order.quantity * order.unit_price) || 0),
      order.payment_status || '',
      order.sales_rep || ''
    ]);

    doc.autoTable({
      head: [['Date', 'Customer', 'Product', 'Type', 'Qty', 'Price', 'Total', 'Status', 'Sales Rep']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`sales_orders_${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Export Successful",
      description: "Sales orders exported to PDF file",
    });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('sales-orders-table');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div style="padding: 20px;">
        <h1>Sales Orders Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        ${printContent.outerHTML}
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle>Sales Orders</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                  <SelectItem value="customer-asc">Customer (A-Z)</SelectItem>
                  <SelectItem value="customer-desc">Customer (Z-A)</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportToCSV} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel} className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Download Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint} className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          {error && (
            <div className="text-red-600 p-4 bg-red-50 rounded mb-4">
              Error loading sales orders: {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading sales orders...</div>
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-auto" id="sales-orders-table">
              <div className="text-sm text-gray-600 mb-2">
                Total Orders: {filteredOrders.length}
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-24">Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-24">Price</TableHead>
                      <TableHead className="w-24">Total</TableHead>
                      <TableHead className="w-20">Status</TableHead>
                      <TableHead>Sales Rep</TableHead>
                      <TableHead className="w-16">Delivery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No sales orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="text-sm">
                            {formatDate(order.order_date)}
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            {order.customer_name}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <div className="font-medium">{order.product}</div>
                              {order.product_type && (
                                <div className="text-xs text-gray-500">{order.product_type}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.quantity}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatCurrency(order.unit_price)}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {formatCurrency((order.quantity * order.unit_price) - (order.discount || 0))}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(order.payment_status)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.sales_rep || '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            <Badge variant={order.delivery_required === 'yes' ? 'default' : 'secondary'} className="text-xs">
                              {order.delivery_required === 'yes' ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderList;
