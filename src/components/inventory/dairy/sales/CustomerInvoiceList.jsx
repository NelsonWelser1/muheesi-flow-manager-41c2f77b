
import React, { useState, useEffect } from 'react';
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
  FileText 
} from "lucide-react";

const CustomerInvoiceList = ({ isOpen, onClose }) => {
  // Mock data for demonstration - would come from API in production
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-12345', 
      customerName: 'John Doe', 
      invoiceDate: '2024-05-15', 
      dueDate: '2024-06-15',
      amount: 250000,
      paymentStatus: 'pending',
      items: [{ description: 'Milk', quantity: 10, price: 25000 }]
    },
    { 
      id: 'INV-12346', 
      customerName: 'Jane Smith', 
      invoiceDate: '2024-05-10', 
      dueDate: '2024-06-10',
      amount: 500000,
      paymentStatus: 'paid',
      items: [{ description: 'Yogurt', quantity: 20, price: 25000 }]
    },
  ]);
  
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Initialize filtered orders when invoices are loaded
  useEffect(() => {
    setFilteredInvoices(invoices);
  }, [invoices]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredInvoices].sort((a, b) => {
      if (key === 'invoiceDate' || key === 'dueDate') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (key === 'amount') {
        return direction === 'asc' 
          ? Number(a[key]) - Number(b[key]) 
          : Number(b[key]) - Number(a[key]);
      }
      
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredInvoices(sortedData);
  };
  
  // Handle search
  useEffect(() => {
    if (!invoices) return;
    
    const filtered = invoices.filter(invoice => {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.customerName?.toLowerCase().includes(searchLower) ||
        invoice.id?.toLowerCase().includes(searchLower) ||
        invoice.paymentStatus?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);
  
  // Handle time range filtering
  useEffect(() => {
    if (!invoices) return;
    if (timeRange === 'all') {
      setFilteredInvoices(invoices);
      return;
    }
    
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
    
    const filtered = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate);
      return invoiceDate >= startDate;
    });
    
    setFilteredInvoices(filtered);
  }, [timeRange, invoices]);
  
  // Export functions
  const exportToCSV = () => {
    const headers = ['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Amount', 'Status'];
    
    const csvData = filteredInvoices.map(invoice => [
      invoice.id,
      invoice.customerName,
      new Date(invoice.invoiceDate).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.amount,
      invoice.paymentStatus
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast({
      title: "Export Successful",
      description: "Invoices exported to CSV"
    });
  };
  
  const exportToExcel = () => {
    toast({
      title: "Excel Export",
      description: "Excel export functionality will be implemented with the xlsx library"
    });
  };
  
  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented with the jspdf library"
    });
  };
  
  // Sharing functions
  const shareByWhatsApp = (invoice) => {
    const invoiceDetails = `
      Invoice: ${invoice.id}
      Customer: ${invoice.customerName}
      Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      Amount: ${invoice.amount.toLocaleString()} UGX
      Status: ${invoice.paymentStatus}
    `;
    
    const encodedText = encodeURIComponent(invoiceDetails);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };
  
  const shareByEmail = (invoice) => {
    const subject = `Invoice - ${invoice.id}`;
    const body = `
      Invoice: ${invoice.id}
      Customer: ${invoice.customerName}
      Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
      Amount: ${invoice.amount.toLocaleString()} UGX
      Status: ${invoice.paymentStatus}
    `;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const saveToLocalAccount = (invoice) => {
    localStorage.setItem(`invoice-${invoice.id}`, JSON.stringify(invoice));
    
    toast({
      title: "Invoice Saved",
      description: "Invoice saved to your local account"
    });
  };
  
  // View invoice details
  const viewInvoiceDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
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
                  <DropdownMenuItem onClick={exportToPDF}>
                    <Printer className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
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
                          onClick={() => viewInvoiceDetails(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.amount.toLocaleString()} UGX</TableCell>
                      <TableCell>
                        <span 
                          className={
                            invoice.paymentStatus === 'paid' 
                              ? 'text-green-600' 
                              : invoice.paymentStatus === 'partially_paid' 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                          }
                        >
                          {invoice.paymentStatus}
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
                              <Share2 className="h-4 w-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => shareByEmail(invoice)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => saveToLocalAccount(invoice)}>
                              <Download className="h-4 w-4 mr-2" />
                              Save Locally
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
            Showing {filteredInvoices.length} of {invoices.length} invoices
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
                  <p className="font-bold">{selectedInvoice.amount.toLocaleString()} UGX</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status:</p>
                  <p className={
                    selectedInvoice.paymentStatus === 'paid' 
                      ? 'text-green-600' 
                      : selectedInvoice.paymentStatus === 'partially_paid' 
                      ? 'text-amber-600' 
                      : 'text-red-600'
                  }>
                    {selectedInvoice.paymentStatus}
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
                        <th className="pb-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">{item.price.toLocaleString()} UGX</td>
                          <td className="py-2">{(item.quantity * item.price).toLocaleString()} UGX</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => exportToPDF()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByEmail(selectedInvoice)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByWhatsApp(selectedInvoice)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerInvoiceList;
