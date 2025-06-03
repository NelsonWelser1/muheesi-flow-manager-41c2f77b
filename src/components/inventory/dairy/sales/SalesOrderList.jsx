import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, ArrowUpDown, Calendar, Download, Printer, Share2, Mail, Filter, FileSpreadsheet, FileText, File, RefreshCw, Save, Users } from "lucide-react";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
const SalesOrderList = ({
  isOpen,
  onClose
}) => {
  const {
    salesOrders,
    loading,
    fetchSalesOrders
  } = useSalesOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  const [timeRange, setTimeRange] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareFileDetails, setShareFileDetails] = useState(null);
  const [localAccounts, setLocalAccounts] = useState([{
    id: 1,
    name: "Admin Account"
  }, {
    id: 2,
    name: "Sales Manager"
  }, {
    id: 3,
    name: "Delivery Manager"
  }]);
  useEffect(() => {
    if (salesOrders) {
      setFilteredOrders(salesOrders);
    }
  }, [salesOrders]);
  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({
      key,
      direction
    });
    const sortedData = [...filteredOrders].sort((a, b) => {
      if (key === 'order_date' || key === 'created_at') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (key === 'total_amount' || key === 'unit_price' || key === 'quantity') {
        return direction === 'asc' ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key]);
      }
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredOrders(sortedData);
  };
  useEffect(() => {
    if (!salesOrders) return;
    const filtered = salesOrders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return order.customer_name?.toLowerCase().includes(searchLower) || order.product?.toLowerCase().includes(searchLower) || order.product_type?.toLowerCase().includes(searchLower) || order.sales_rep?.toLowerCase().includes(searchLower) || order.notes?.toLowerCase().includes(searchLower);
    });
    setFilteredOrders(filtered);
  }, [searchTerm, salesOrders]);
  useEffect(() => {
    if (!salesOrders) return;
    if (timeRange === 'all') {
      setFilteredOrders(salesOrders);
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
    const filtered = salesOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate;
    });
    setFilteredOrders(filtered);
  }, [timeRange, salesOrders]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSalesOrders();
      toast({
        title: "Data refreshed",
        description: "Sales orders have been refreshed"
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh sales orders",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  const exportToCSV = () => {
    if (!filteredOrders?.length) {
      toast({
        title: "No data to export",
        description: "There are no orders to export",
        variant: "destructive"
      });
      return;
    }
    const headers = ['Customer', 'Date', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Status'];
    const csvData = filteredOrders.map(order => [order.customer_name, new Date(order.order_date).toLocaleDateString(), order.product, order.product_type || '-', order.quantity, order.unit_price, order.total_amount, order.payment_status]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.map(cell => typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n')) ? `"${cell.replace(/"/g, '""')}"` : cell).join(','))].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: "Sales orders exported to CSV"
    });
    return {
      blob,
      url,
      fileName: `sales-orders-${new Date().toISOString().split('T')[0]}.csv`
    };
  };
  const exportToExcel = () => {
    if (!filteredOrders?.length) {
      toast({
        title: "No data to export",
        description: "There are no orders to export",
        variant: "destructive"
      });
      return;
    }
    const headers = ['Customer', 'Date', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Status'];
    let excelContent = '<?xml version="1.0"?>\n';
    excelContent += '<?mso-application progid="Excel.Sheet"?>\n';
    excelContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
    excelContent += '<Worksheet ss:Name="Sales Orders">\n';
    excelContent += '<Table>\n';
    excelContent += '<Row>\n';
    headers.forEach(header => {
      excelContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>\n`;
    });
    excelContent += '</Row>\n';
    filteredOrders.forEach(order => {
      excelContent += '<Row>\n';
      excelContent += `<Cell><Data ss:Type="String">${order.customer_name}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="String">${new Date(order.order_date).toLocaleDateString()}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="String">${order.product}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="String">${order.product_type || '-'}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="Number">${order.quantity}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="Number">${order.unit_price}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="Number">${order.total_amount}</Data></Cell>\n`;
      excelContent += `<Cell><Data ss:Type="String">${order.payment_status}</Data></Cell>\n`;
      excelContent += '</Row>\n';
    });
    excelContent += '</Table>\n';
    excelContent += '</Worksheet>\n';
    excelContent += '</Workbook>';
    const blob = new Blob([excelContent], {
      type: 'application/vnd.ms-excel'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-orders-${new Date().toISOString().split('T')[0]}.xls`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: "Sales orders exported to Excel format"
    });
    return {
      blob,
      url,
      fileName: `sales-orders-${new Date().toISOString().split('T')[0]}.xls`
    };
  };
  const exportToPDF = () => {
    if (!filteredOrders?.length) {
      toast({
        title: "No data to export",
        description: "There are no orders to export",
        variant: "destructive"
      });
      return;
    }
    let htmlContent = '<html><head><style>';
    htmlContent += 'body { font-family: Arial, sans-serif; }';
    htmlContent += 'table { width: 100%; border-collapse: collapse; }';
    htmlContent += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
    htmlContent += 'th { background-color: #f2f2f2; }';
    htmlContent += 'h1 { text-align: center; }';
    htmlContent += '.footer { text-align: center; margin-top: 20px; font-size: 12px; }';
    htmlContent += '</style></head><body>';
    htmlContent += '<h1>Sales Orders Report</h1>';
    htmlContent += `<p>Generated on: ${new Date().toLocaleString()}</p>`;
    htmlContent += '<table>';
    htmlContent += '<tr>';
    ['Customer', 'Date', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Status'].forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += '</tr>';
    filteredOrders.forEach(order => {
      htmlContent += '<tr>';
      htmlContent += `<td>${order.customer_name}</td>`;
      htmlContent += `<td>${new Date(order.order_date).toLocaleDateString()}</td>`;
      htmlContent += `<td>${order.product}</td>`;
      htmlContent += `<td>${order.product_type || '-'}</td>`;
      htmlContent += `<td>${order.quantity}</td>`;
      htmlContent += `<td>${order.unit_price}</td>`;
      htmlContent += `<td>${order.total_amount}</td>`;
      htmlContent += `<td>${order.payment_status}</td>`;
      htmlContent += '</tr>';
    });
    htmlContent += '</table>';
    htmlContent += '<div class="footer">© Muheesi GKK Integrated System</div>';
    htmlContent += '</body></html>';
    const blob = new Blob([htmlContent], {
      type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.document.title = `sales-orders-${new Date().toISOString().split('T')[0]}.pdf`;
        printWindow.print();
        toast({
          title: "PDF Export",
          description: "The report has been opened for printing/saving as PDF"
        });
      };
    } else {
      toast({
        title: "Export Error",
        description: "Could not open PDF for printing. Please check your popup settings.",
        variant: "destructive"
      });
    }
    return {
      blob,
      url,
      htmlContent,
      fileName: `sales-orders-${new Date().toISOString().split('T')[0]}.pdf`
    };
  };
  const prepareFileForSharing = format => {
    let fileDetails;
    switch (format) {
      case 'csv':
        fileDetails = exportToCSV();
        break;
      case 'excel':
        fileDetails = exportToExcel();
        break;
      case 'pdf':
        fileDetails = exportToPDF();
        break;
      default:
        fileDetails = exportToCSV();
    }
    return fileDetails;
  };
  const shareByWhatsApp = format => {
    const fileDetails = prepareFileForSharing(format);
    if (!fileDetails) return;
    const messageText = `I'm sharing the ${format.toUpperCase()} export of our sales orders: ${window.location.origin}/shared-files/${fileDetails.fileName}`;
    try {
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(`whatsapp://send?text=${encodeURIComponent(messageText)}`, '_blank');
      } else {
        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
      }
      toast({
        title: "WhatsApp Sharing",
        description: `File prepared for sharing via WhatsApp`
      });
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not open WhatsApp. The file has been downloaded locally.",
        variant: "destructive"
      });
    }
  };
  const shareByEmail = format => {
    const fileDetails = prepareFileForSharing(format);
    if (!fileDetails) return;
    const subject = `Sales Orders Export (${format.toUpperCase()})`;
    const body = `Please find attached the sales orders export in ${format.toUpperCase()} format.
    
This export was generated on ${new Date().toLocaleString()}.
    
Regards,
Muheesi GKK Integrated System`;
    try {
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast({
        title: "Email Sharing",
        description: `File prepared for sharing via email. Please attach the downloaded file to your email.`
      });
    } catch (error) {
      console.error("Error sharing via email:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not open email client. The file has been downloaded locally.",
        variant: "destructive"
      });
    }
  };
  const shareToLocalAccount = format => {
    const fileDetails = prepareFileForSharing(format);
    if (!fileDetails) return;
    setShareFileDetails({
      ...fileDetails,
      format,
      timestamp: new Date().toISOString()
    });
    setShareDialogOpen(true);
  };
  const completeLocalShare = accountId => {
    try {
      if (!shareFileDetails) return;
      const selectedAccount = localAccounts.find(account => account.id === accountId);
      if (!selectedAccount) {
        throw new Error("Selected account not found");
      }
      const shareRecord = {
        timestamp: shareFileDetails.timestamp,
        fileName: shareFileDetails.fileName,
        format: shareFileDetails.format,
        sharedTo: selectedAccount.name,
        url: shareFileDetails.url
      };
      const existingShares = JSON.parse(localStorage.getItem('sharedSalesOrderFiles') || '[]');
      existingShares.unshift(shareRecord);
      localStorage.setItem('sharedSalesOrderFiles', JSON.stringify(existingShares.slice(0, 50)));
      toast({
        title: "File Shared",
        description: `${shareFileDetails.format.toUpperCase()} file has been shared to ${selectedAccount.name}`
      });
      setShareDialogOpen(false);
      setShareFileDetails(null);
    } catch (error) {
      console.error("Error sharing to local account:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not share file to selected account.",
        variant: "destructive"
      });
    }
  };
  const shareExport = (format, method) => {
    switch (method) {
      case 'whatsapp':
        shareByWhatsApp(format);
        break;
      case 'email':
        shareByEmail(format);
        break;
      case 'local':
        shareToLocalAccount(format);
        break;
      default:
        console.error("Invalid sharing method");
    }
  };
  const viewOrderDetails = order => {
    setSelectedOrder(order);
  };
  return <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
        <SheetHeader className="pb-4">
          <SheetTitle>Sales Orders</SheetTitle>
          <SheetDescription>
            View and manage your sales orders
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="relative flex-grow max-w-sm">
              <Input placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full" />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className={isRefreshing ? "animate-spin" : ""}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              
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
                  <DropdownMenuItem onClick={() => exportToCSV()}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel()}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </DropdownMenuItem>
                  
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  
                </DropdownMenuTrigger>
                
              </DropdownMenu>
            </div>
          </div>
          
          {loading || isRefreshing ? <div className="text-center py-8">Loading sales orders...</div> : <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">View</TableHead>
                    <TableHead>
                      <button className="flex items-center" onClick={() => handleSort('customer_name')}>
                        Customer
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button className="flex items-center" onClick={() => handleSort('product')}>
                        Product
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button className="flex items-center" onClick={() => handleSort('order_date')}>
                        Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button className="flex items-center" onClick={() => handleSort('total_amount')}>
                        Total
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button className="flex items-center" onClick={() => handleSort('payment_status')}>
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? filteredOrders.map(order => <TableRow key={order.id}>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{order.product} {order.product_type ? `(${order.product_type})` : ''}</TableCell>
                        <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>{Number(order.total_amount).toLocaleString()} UGX</TableCell>
                        <TableCell>
                          <span className={order.payment_status === 'paid' ? 'text-green-600' : order.payment_status === 'partially_paid' ? 'text-amber-600' : 'text-red-600'}>
                            {order.payment_status.replace('_', ' ')}
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
                              <DropdownMenuItem onClick={() => shareByWhatsApp('pdf')}>
                                <Share2 className="h-4 w-4 mr-2" />
                                WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareByEmail('pdf')}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareToLocalAccount('pdf')}>
                                <Users className="h-4 w-4 mr-2" />
                                Share Locally
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>) : <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No sales orders found
                      </TableCell>
                    </TableRow>}
                </TableBody>
              </Table>
            </div>}
          
          {selectedOrder && <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>Close</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer:</p>
                  <p>{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date:</p>
                  <p>{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Product:</p>
                  <p>{selectedOrder.product} {selectedOrder.product_type ? `(${selectedOrder.product_type})` : ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quantity:</p>
                  <p>{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Unit Price:</p>
                  <p>{Number(selectedOrder.unit_price).toLocaleString()} UGX</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Discount:</p>
                  <p>{selectedOrder.discount || 0}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount:</p>
                  <p className="font-bold">{Number(selectedOrder.total_amount).toLocaleString()} UGX</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status:</p>
                  <p className={selectedOrder.payment_status === 'paid' ? 'text-green-600' : selectedOrder.payment_status === 'partially_paid' ? 'text-amber-600' : 'text-red-600'}>
                    {selectedOrder.payment_status.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Sales Rep:</p>
                  <p>{selectedOrder.sales_rep || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery Required:</p>
                  <p>{selectedOrder.delivery_required === 'yes' ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes:</p>
                  <p>{selectedOrder.notes || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => exportToPDF()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByEmail('pdf')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByWhatsApp('pdf')}>
                  <Share2 className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>}
        </div>
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share to Local Account</DialogTitle>
              <DialogDescription>
                Select which account in the system you want to share this file with.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">File details:</h3>
                  <p className="text-sm">Format: {shareFileDetails?.format?.toUpperCase()}</p>
                  <p className="text-sm">Filename: {shareFileDetails?.fileName}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select account:</h3>
                  {localAccounts.map(account => <div key={account.id} className="flex items-center">
                      <Button variant="outline" className="w-full justify-start text-left" onClick={() => completeLocalShare(account.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        {account.name}
                      </Button>
                    </div>)}
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>;
};
export default SalesOrderList;