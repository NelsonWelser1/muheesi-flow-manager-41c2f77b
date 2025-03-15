
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DownloadCloud, 
  RefreshCw, 
  Search, 
  Mail, 
  Phone, 
  FileText, 
  FileSpreadsheet,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { utils, writeFileXLSX } from 'xlsx';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return "bg-green-100 text-green-800 border-green-300";
    case 'partially_paid':
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 'pending':
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const CustomerInvoiceList = ({ isOpen, onClose, invoices = [], isLoading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { toast } = useToast();
  const [printRef] = useState(React.createRef());

  // Filter invoices based on search, time range, and tab
  const filterInvoices = () => {
    let filtered = [...(invoices || [])];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.customer_name?.toLowerCase().includes(term) || 
        invoice.id?.toLowerCase().includes(term)
      );
    }
    
    // Apply time range filter
    const now = new Date();
    if (timeRange === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      filtered = filtered.filter(invoice => invoice.created_at >= today);
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(invoice => invoice.created_at >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      filtered = filtered.filter(invoice => invoice.created_at >= monthAgo);
    }
    
    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(invoice => invoice.payment_status === selectedTab);
    }
    
    return filtered;
  };

  const filteredInvoices = filterInvoices();

  // Export to PDF
  const exportToPdf = async (invoice) => {
    try {
      const invoiceId = invoice.id;
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('INVOICE', 105, 20, { align: 'center' });
      
      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoiceId}`, 20, 40);
      doc.text(`Date: ${formatDate(invoice.invoice_date)}`, 20, 50);
      doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 20, 60);
      
      // Add customer details
      doc.text('Bill To:', 120, 40);
      doc.text(`${invoice.customer_name}`, 120, 50);
      doc.text(`${invoice.customer_contact || 'N/A'}`, 120, 60);
      doc.text(`${invoice.billing_address || 'N/A'}`, 120, 70);
      
      // Add items table
      doc.setFontSize(10);
      let y = 90;
      
      // Table header
      doc.text('Description', 20, y);
      doc.text('Qty', 100, y);
      doc.text('Price', 120, y);
      doc.text('Tax', 140, y);
      doc.text('Total', 170, y);
      y += 10;
      
      // Draw header line
      doc.line(20, y-5, 190, y-5);
      
      // Table rows
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          doc.text(item.description || 'Item', 20, y);
          doc.text(item.quantity?.toString() || '1', 100, y);
          doc.text(item.price?.toString() || '0', 120, y);
          doc.text(item.tax?.toString() + '%' || '0%', 140, y);
          doc.text(item.total?.toString() || '0', 170, y);
          y += 10;
        });
      }
      
      // Draw line after items
      doc.line(20, y-5, 190, y-5);
      
      // Add totals
      y += 10;
      doc.text(`Subtotal: ${invoice.total_amount || 0}`, 140, y);
      y += 10;
      doc.text(`Tax: ${invoice.tax || 0}%`, 140, y);
      y += 10;
      doc.text(`Discount: ${invoice.discount || 0}%`, 140, y);
      y += 10;
      doc.text(`Total Amount: UGX ${invoice.total_amount?.toLocaleString() || 0}`, 140, y);
      
      // Add payment details
      y += 20;
      doc.text(`Payment Status: ${invoice.payment_status || 'Pending'}`, 20, y);
      y += 10;
      doc.text(`Payment Terms: ${invoice.payment_terms || 'N/A'}`, 20, y);
      
      // Save PDF
      doc.save(`Invoice-${invoiceId}.pdf`);
      
      toast({
        title: "Success",
        description: "Invoice exported to PDF successfully",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export invoice to PDF",
        variant: "destructive"
      });
    }
  };
  
  // Export to Excel
  const exportToExcel = (invoice) => {
    try {
      const invoiceId = invoice.id;
      
      // Prepare invoice data for Excel
      const wsData = [
        ['INVOICE', '', '', '', ''],
        ['', '', '', '', ''],
        ['Invoice #:', invoiceId, '', 'Bill To:', ''],
        ['Date:', formatDate(invoice.invoice_date), '', invoice.customer_name, ''],
        ['Due Date:', formatDate(invoice.due_date), '', invoice.customer_contact || 'N/A', ''],
        ['', '', '', invoice.billing_address || 'N/A', ''],
        ['', '', '', '', ''],
        ['Description', 'Quantity', 'Price', 'Tax (%)', 'Total'],
      ];
      
      // Add items
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          wsData.push([
            item.description || 'Item',
            item.quantity?.toString() || '1',
            item.price?.toString() || '0',
            item.tax?.toString() || '0',
            item.total?.toString() || '0'
          ]);
        });
      }
      
      // Add totals
      wsData.push(['', '', '', '', '']);
      wsData.push(['', '', '', 'Subtotal:', invoice.total_amount || 0]);
      wsData.push(['', '', '', 'Tax:', `${invoice.tax || 0}%`]);
      wsData.push(['', '', '', 'Discount:', `${invoice.discount || 0}%`]);
      wsData.push(['', '', '', 'Total Amount:', `UGX ${invoice.total_amount?.toLocaleString() || 0}`]);
      wsData.push(['', '', '', '', '']);
      wsData.push(['Payment Status:', invoice.payment_status || 'Pending', '', '', '']);
      wsData.push(['Payment Terms:', invoice.payment_terms || 'N/A', '', '', '']);
      
      // Create worksheet and workbook
      const ws = utils.aoa_to_sheet(wsData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Invoice');
      
      // Generate Excel file
      writeFileXLSX(wb, `Invoice-${invoiceId}.xlsx`);
      
      toast({
        title: "Success",
        description: "Invoice exported to Excel successfully",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export invoice to Excel",
        variant: "destructive"
      });
    }
  };
  
  // Export to CSV
  const exportToCsv = (invoice) => {
    try {
      const invoiceId = invoice.id;
      
      // Prepare CSV headers
      let csv = 'Description,Quantity,Price,Tax,Total\n';
      
      // Add items
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          csv += `"${item.description || 'Item'}",${item.quantity || 1},${item.price || 0},${item.tax || 0},${item.total || 0}\n`;
        });
      }
      
      // Add totals
      csv += `\nSubtotal,,,,${invoice.total_amount || 0}\n`;
      csv += `Tax,,,,${invoice.tax || 0}%\n`;
      csv += `Discount,,,,${invoice.discount || 0}%\n`;
      csv += `Total Amount,,,,UGX ${invoice.total_amount?.toLocaleString() || 0}\n`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Invoice-${invoiceId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Invoice exported to CSV successfully",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export invoice to CSV",
        variant: "destructive"
      });
    }
  };
  
  // Print invoice
  const printInvoice = async (invoice) => {
    setSelectedInvoice(invoice);
    
    // Wait for the DOM to update with the selected invoice
    setTimeout(() => {
      if (printRef.current) {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print Invoice</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .bill-to, .invoice-info { max-width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .totals { margin-left: auto; width: 50%; }
          .totals table { margin-left: auto; width: 100%; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }, 100);
  };
  
  // Share via Email
  const shareViaEmail = (invoice) => {
    try {
      const subject = `Invoice ${invoice.id} from Your Company`;
      const body = `
        Dear ${invoice.customer_name},
        
        Please find attached your invoice ${invoice.id} for the amount of UGX ${invoice.total_amount?.toLocaleString() || 0}.
        
        Invoice Date: ${formatDate(invoice.invoice_date)}
        Due Date: ${formatDate(invoice.due_date)}
        
        Thank you for your business.
        
        Regards,
        Your Company
      `;
      
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      toast({
        title: "Email Client Opened",
        description: "Please attach the exported invoice file to your email",
      });
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Error",
        description: "Failed to open email client",
        variant: "destructive"
      });
    }
  };
  
  // Share via WhatsApp
  const shareViaWhatsApp = (invoice) => {
    try {
      const text = `
        Invoice ${invoice.id} from Your Company
        
        Amount: UGX ${invoice.total_amount?.toLocaleString() || 0}
        Invoice Date: ${formatDate(invoice.invoice_date)}
        Due Date: ${formatDate(invoice.due_date)}
        
        Thank you for your business.
      `;
      
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      
      toast({
        title: "WhatsApp Opened",
        description: "Please send the message and attach the exported invoice file",
      });
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to open WhatsApp",
        variant: "destructive"
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customer Invoices</SheetTitle>
          <SheetDescription>
            View and manage all customer invoices
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 py-4">
          {/* Top Controls */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="ml-2">Refresh</span>
              </Button>
              
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partially_paid">Partially Paid</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <InvoicesTable 
                invoices={filteredInvoices} 
                exportToPdf={exportToPdf}
                exportToExcel={exportToExcel}
                exportToCsv={exportToCsv}
                printInvoice={printInvoice}
                shareViaEmail={shareViaEmail}
                shareViaWhatsApp={shareViaWhatsApp}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <InvoicesTable 
                invoices={filteredInvoices} 
                exportToPdf={exportToPdf}
                exportToExcel={exportToExcel}
                exportToCsv={exportToCsv}
                printInvoice={printInvoice}
                shareViaEmail={shareViaEmail}
                shareViaWhatsApp={shareViaWhatsApp}
              />
            </TabsContent>
            
            <TabsContent value="partially_paid" className="mt-0">
              <InvoicesTable 
                invoices={filteredInvoices} 
                exportToPdf={exportToPdf}
                exportToExcel={exportToExcel}
                exportToCsv={exportToCsv}
                printInvoice={printInvoice}
                shareViaEmail={shareViaEmail}
                shareViaWhatsApp={shareViaWhatsApp}
              />
            </TabsContent>
            
            <TabsContent value="paid" className="mt-0">
              <InvoicesTable 
                invoices={filteredInvoices} 
                exportToPdf={exportToPdf}
                exportToExcel={exportToExcel}
                exportToCsv={exportToCsv}
                printInvoice={printInvoice}
                shareViaEmail={shareViaEmail}
                shareViaWhatsApp={shareViaWhatsApp}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Printable Content (Hidden) */}
        {selectedInvoice && (
          <div ref={printRef} style={{ display: 'none' }}>
            <div className="invoice-header">
              <h1>INVOICE</h1>
            </div>
            
            <div className="invoice-details">
              <div className="invoice-info">
                <p><strong>Invoice #:</strong> {selectedInvoice.id}</p>
                <p><strong>Date:</strong> {formatDate(selectedInvoice.invoice_date)}</p>
                <p><strong>Due Date:</strong> {formatDate(selectedInvoice.due_date)}</p>
              </div>
              
              <div className="bill-to">
                <p><strong>Bill To:</strong></p>
                <p>{selectedInvoice.customer_name}</p>
                <p>{selectedInvoice.customer_contact || 'N/A'}</p>
                <p>{selectedInvoice.billing_address || 'N/A'}</p>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Tax (%)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items && Array.isArray(selectedInvoice.items) && 
                 selectedInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description || 'Item'}</td>
                    <td>{item.quantity || 1}</td>
                    <td>{item.price || 0}</td>
                    <td>{item.tax || 0}%</td>
                    <td>{item.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="totals">
              <table>
                <tbody>
                  <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td>{selectedInvoice.total_amount || 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Tax:</strong></td>
                    <td>{selectedInvoice.tax || 0}%</td>
                  </tr>
                  <tr>
                    <td><strong>Discount:</strong></td>
                    <td>{selectedInvoice.discount || 0}%</td>
                  </tr>
                  <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td>UGX {selectedInvoice.total_amount?.toLocaleString() || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="payment-details">
              <p><strong>Payment Status:</strong> {selectedInvoice.payment_status || 'Pending'}</p>
              <p><strong>Payment Terms:</strong> {selectedInvoice.payment_terms || 'N/A'}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Separate Invoices Table component
const InvoicesTable = ({ 
  invoices, 
  exportToPdf, 
  exportToExcel, 
  exportToCsv, 
  printInvoice,
  shareViaEmail,
  shareViaWhatsApp
}) => {
  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                <TableCell>{formatDate(invoice.due_date)}</TableCell>
                <TableCell>UGX {invoice.total_amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.payment_status)}>
                    {invoice.payment_status === 'partially_paid' 
                      ? 'Partially Paid' 
                      : invoice.payment_status === 'paid' 
                        ? 'Paid' 
                        : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="dropdown relative">
                      <Button variant="outline" size="icon">
                        <DownloadCloud className="h-4 w-4" />
                      </Button>
                      <div className="dropdown-content absolute z-10 right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-md hidden">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => exportToPdf(invoice)}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          PDF
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => exportToExcel(invoice)}
                        >
                          <FileSpreadsheet className="h-3 w-3 mr-2" />
                          Excel
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => exportToCsv(invoice)}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          CSV
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => printInvoice(invoice)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => shareViaEmail(invoice)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => shareViaWhatsApp(invoice)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerInvoiceList;
