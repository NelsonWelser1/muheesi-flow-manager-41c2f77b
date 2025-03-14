
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Eye, 
  ArrowUpDown, 
  Calendar, 
  Download, 
  Printer, 
  Share2, 
  Mail, 
  FileSpreadsheet, 
  FileText,
  RefreshCw,
  Phone
} from "lucide-react";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const CustomerInvoiceList = ({ isOpen, onClose }) => {
  // Mock data for demonstration - would come from API in production
  const [allInvoices, setAllInvoices] = useState([
    { 
      id: 'INV-12345', 
      customerName: 'John Doe', 
      invoiceDate: '2024-05-15', 
      dueDate: '2024-06-15',
      amount: 250000,
      paymentStatus: 'pending',
      items: [
        { description: 'Milk', quantity: 10, price: 25000, tax: 5, discount: 0, total: 262500 }
      ]
    },
    { 
      id: 'INV-12346', 
      customerName: 'Jane Smith', 
      invoiceDate: '2024-05-10', 
      dueDate: '2024-06-10',
      amount: 500000,
      paymentStatus: 'paid',
      items: [
        { description: 'Yogurt', quantity: 20, price: 25000, tax: 0, discount: 0, total: 500000 }
      ]
    },
    { 
      id: 'INV-12347', 
      customerName: 'Robert Johnson', 
      invoiceDate: '2024-05-20', 
      dueDate: '2024-06-20',
      amount: 760000,
      paymentStatus: 'partially_paid',
      items: [
        { description: 'Cheese', quantity: 5, price: 120000, tax: 10, discount: 20000, total: 650000 },
        { description: 'Butter', quantity: 2, price: 55000, tax: 0, discount: 0, total: 110000 }
      ]
    },
    { 
      id: 'INV-12348', 
      customerName: 'Mary Williams', 
      invoiceDate: '2024-04-25', 
      dueDate: '2024-05-25',
      amount: 435000,
      paymentStatus: 'overdue',
      items: [
        { description: 'Fresh Milk', quantity: 15, price: 29000, tax: 0, discount: 0, total: 435000 }
      ]
    },
  ]);
  
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const printFrameRef = useRef(null);
  
  // Initialize filtered invoices when all invoices are loaded
  useEffect(() => {
    applyFilters();
  }, [allInvoices, searchTerm, timeRange, statusFilter]);
  
  // Apply all filters and sorting
  const applyFilters = () => {
    let filtered = [...allInvoices];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => {
        return (
          invoice.customerName?.toLowerCase().includes(searchLower) ||
          invoice.id?.toLowerCase().includes(searchLower) ||
          invoice.paymentStatus?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.paymentStatus === statusFilter);
    }
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate >= startDate;
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'invoiceDate' || sortConfig.key === 'dueDate') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' 
            ? Number(a[sortConfig.key]) - Number(b[sortConfig.key]) 
            : Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredInvoices(filtered);
  };
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Refresh invoices data
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      // In a real app, you would fetch fresh data from the backend here
      // For now, just reapply filters with existing data
      applyFilters();
      setIsRefreshing(false);
      
      toast({
        title: "Refreshed",
        description: "Invoice list has been refreshed",
      });
    }, 800);
  };
  
  // Export functions
  const exportToCSV = () => {
    const header = ['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Amount', 'Status'];
    
    const data = filteredInvoices.map(invoice => [
      invoice.id,
      invoice.customerName,
      new Date(invoice.invoiceDate).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.amount,
      invoice.paymentStatus
    ]);
    
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    
    XLSX.writeFile(wb, `invoices-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export Successful",
      description: "Invoices exported to CSV"
    });
  };
  
  const exportToExcel = () => {
    const header = ['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Amount', 'Status'];
    
    const data = filteredInvoices.map(invoice => [
      invoice.id,
      invoice.customerName,
      new Date(invoice.invoiceDate).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.amount,
      invoice.paymentStatus
    ]);
    
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    
    XLSX.writeFile(wb, `invoices-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Invoices exported to Excel"
    });
  };
  
  const exportToPDF = (invoice = null) => {
    const doc = new jsPDF();
    
    if (invoice) {
      // Export single invoice to PDF
      doc.setFontSize(18);
      doc.text('INVOICE', 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.id}`, 14, 30);
      doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 14, 38);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 46);
      
      doc.text(`Customer: ${invoice.customerName}`, 14, 60);
      
      doc.text(`Status: ${invoice.paymentStatus.toUpperCase()}`, 14, 74);
      
      // Add table for items
      const tableColumn = ["Item", "Qty", "Price", "Tax", "Discount", "Total"];
      const tableRows = [];
      
      invoice.items.forEach(item => {
        const itemData = [
          item.description,
          item.quantity,
          `UGX ${Number(item.price).toLocaleString()}`,
          `${item.tax}%`,
          `UGX ${Number(item.discount).toLocaleString()}`,
          `UGX ${Number(item.total).toLocaleString()}`
        ];
        tableRows.push(itemData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [0, 0, 160],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 60 },
          5: { halign: 'right' }
        }
      });
      
      // Add total
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Amount: UGX ${invoice.amount.toLocaleString()}`, 150, finalY, { align: 'right' });
      
      doc.save(`invoice-${invoice.id}.pdf`);
    } else {
      // Export all filtered invoices
      doc.setFontSize(18);
      doc.text('INVOICES LIST', 105, 15, { align: 'center' });
      
      const tableColumn = ["Invoice #", "Customer", "Date", "Due Date", "Amount", "Status"];
      const tableRows = [];
      
      filteredInvoices.forEach(invoice => {
        const itemData = [
          invoice.id,
          invoice.customerName,
          new Date(invoice.invoiceDate).toLocaleDateString(),
          new Date(invoice.dueDate).toLocaleDateString(),
          `UGX ${invoice.amount.toLocaleString()}`,
          invoice.paymentStatus
        ];
        tableRows.push(itemData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [0, 0, 160],
          textColor: 255
        }
      });
      
      doc.save(`invoices-list-${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
    toast({
      title: "Export Successful",
      description: "Invoices exported to PDF"
    });
  };
  
  // Prepare HTML content for printing
  const printInvoice = (invoice) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-details div {
            width: 45%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #0000a0;
            color: white;
          }
          .total-row {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <h2>${invoice.id}</h2>
        </div>
        
        <div class="invoice-details">
          <div>
            <p><strong>From:</strong> Grand Berna Dairies</p>
            <p>Kampala, Uganda</p>
            <p>Email: info@grandberna.com</p>
          </div>
          <div>
            <p><strong>To:</strong> ${invoice.customerName}</p>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.paymentStatus}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Tax (%)</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>UGX ${Number(item.price).toLocaleString()}</td>
                <td>${item.tax}%</td>
                <td>UGX ${Number(item.discount).toLocaleString()}</td>
                <td>UGX ${Number(item.total).toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align: right;"><strong>Total Amount:</strong></td>
              <td>UGX ${invoice.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 30px;">
          <p><strong>Payment Terms:</strong> Please pay the due amount by the due date.</p>
          <p><strong>Thank you for your business!</strong></p>
        </div>
      </body>
      </html>
    `;
    
    // Create an iframe to print from
    if (printFrameRef.current) {
      const iframe = printFrameRef.current;
      const iframeWindow = iframe.contentWindow || iframe;
      
      iframe.srcdoc = printContent;
      
      iframe.onload = function() {
        setTimeout(() => {
          iframeWindow.focus();
          iframeWindow.print();
        }, 200);
      };
    }
  };
  
  // Sharing functions
  const shareByWhatsApp = (invoice) => {
    const invoiceDetails = `
      Invoice: ${invoice.id}
      Customer: ${invoice.customerName}
      Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      Amount: UGX ${invoice.amount.toLocaleString()}
      Status: ${invoice.paymentStatus}
    `;
    
    const encodedText = encodeURIComponent(invoiceDetails);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    
    toast({
      title: "Invoice Shared",
      description: "Invoice details sent via WhatsApp"
    });
  };
  
  const shareByEmail = (invoice) => {
    const subject = `Invoice - ${invoice.id}`;
    const body = `
      Invoice: ${invoice.id}
      Customer: ${invoice.customerName}
      Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      Amount: UGX ${invoice.amount.toLocaleString()}
      Status: ${invoice.paymentStatus}
    `;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast({
      title: "Invoice Shared",
      description: "Invoice details sent via email"
    });
  };

  return (
    <>
      <iframe
        ref={printFrameRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />
      
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
          <SheetHeader className="pb-4">
            <SheetTitle>Customer Invoices</SheetTitle>
            <SheetDescription>
              View and manage your customer invoices
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col gap-4">
            {/* Search and filters */}
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="relative flex-grow max-w-sm">
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportToCSV}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToExcel}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportToPDF()}>
                      <Printer className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Status tabs */}
            <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="partially_paid">Partial</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Invoices table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">View</TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('id')}
                      >
                        Invoice #
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('customerName')}
                      >
                        Customer
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('invoiceDate')}
                      >
                        Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('paymentStatus')}
                      >
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                        <TableCell>UGX {invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span 
                            className={
                              invoice.paymentStatus === 'paid' 
                                ? 'text-green-600' 
                                : invoice.paymentStatus === 'partially_paid' 
                                ? 'text-amber-600' 
                                : invoice.paymentStatus === 'overdue'
                                ? 'text-red-600 font-semibold'
                                : 'text-blue-600'
                            }
                          >
                            {invoice.paymentStatus.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Share Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => shareByWhatsApp(invoice)}>
                                <Phone className="h-4 w-4 mr-2" />
                                WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareByEmail(invoice)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportToPDF(invoice)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => printInvoice(invoice)}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredInvoices.length} of {allInvoices.length} invoices
            </div>
            
            {/* Invoice Details Modal */}
            {selectedInvoice && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Invoice Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>Close</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Invoice Number:</p>
                    <p>{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer:</p>
                    <p>{selectedInvoice.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice Date:</p>
                    <p>{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Due Date:</p>
                    <p>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Amount:</p>
                    <p className="font-bold">UGX {selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Status:</p>
                    <p className={
                      selectedInvoice.paymentStatus === 'paid' 
                        ? 'text-green-600' 
                        : selectedInvoice.paymentStatus === 'partially_paid' 
                        ? 'text-amber-600' 
                        : selectedInvoice.paymentStatus === 'overdue'
                        ? 'text-red-600 font-semibold'
                        : 'text-blue-600'
                    }>
                      {selectedInvoice.paymentStatus.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Items:</p>
                    <table className="w-full mt-2">
                      <thead>
                        <tr className="text-sm text-left border-b">
                          <th className="pb-2">Description</th>
                          <th className="pb-2">Quantity</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2">Tax</th>
                          <th className="pb-2">Discount</th>
                          <th className="pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{item.description}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">UGX {item.price.toLocaleString()}</td>
                            <td className="py-2">{item.tax}%</td>
                            <td className="py-2">UGX {item.discount.toLocaleString()}</td>
                            <td className="py-2">UGX {item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => printInvoice(selectedInvoice)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => shareByEmail(selectedInvoice)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => shareByWhatsApp(selectedInvoice)}>
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportToPDF(selectedInvoice)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CustomerInvoiceList;
