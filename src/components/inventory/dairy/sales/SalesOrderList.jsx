
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
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
  Filter, 
  FileSpreadsheet, 
  FileText 
} from "lucide-react";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';

const SalesOrderList = ({ isOpen, onClose }) => {
  const { salesOrders, loading } = useSalesOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Initialize filtered orders when sales orders are loaded
  useEffect(() => {
    if (salesOrders) {
      setFilteredOrders(salesOrders);
    }
  }, [salesOrders]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredOrders].sort((a, b) => {
      if (key === 'order_date' || key === 'created_at') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (key === 'total_amount' || key === 'unit_price' || key === 'quantity') {
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
    
    setFilteredOrders(sortedData);
  };
  
  // Handle search
  useEffect(() => {
    if (!salesOrders) return;
    
    const filtered = salesOrders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.customer_name?.toLowerCase().includes(searchLower) ||
        order.product?.toLowerCase().includes(searchLower) ||
        order.product_type?.toLowerCase().includes(searchLower) ||
        order.sales_rep?.toLowerCase().includes(searchLower) ||
        order.notes?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredOrders(filtered);
  }, [searchTerm, salesOrders]);
  
  // Handle time range filtering
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
  
  // Export functions
  const exportToCSV = () => {
    const headers = ['Customer', 'Date', 'Product', 'Type', 'Quantity', 'Unit Price', 'Total', 'Status'];
    
    const csvData = filteredOrders.map(order => [
      order.customer_name,
      new Date(order.order_date).toLocaleDateString(),
      order.product,
      order.product_type || '-',
      order.quantity,
      order.unit_price,
      order.total_amount,
      order.payment_status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast({
      title: "Export Successful",
      description: "Sales orders exported to CSV"
    });
  };
  
  const exportToExcel = () => {
    // This would typically use a library like xlsx, but we'll show a toast for now
    toast({
      title: "Excel Export",
      description: "Excel export functionality will be implemented with the xlsx library"
    });
  };
  
  const exportToPDF = () => {
    // This would typically use a library like jspdf, but we'll show a toast for now
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented with the jspdf library"
    });
  };
  
  // Sharing functions
  const shareByWhatsApp = (order) => {
    const orderDetails = `
      Customer: ${order.customer_name}
      Product: ${order.product} ${order.product_type ? `(${order.product_type})` : ''}
      Quantity: ${order.quantity}
      Total: ${order.total_amount}
      Date: ${new Date(order.order_date).toLocaleDateString()}
    `;
    
    const encodedText = encodeURIComponent(orderDetails);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };
  
  const shareByEmail = (order) => {
    const subject = `Sales Order - ${order.customer_name}`;
    const body = `
      Customer: ${order.customer_name}
      Product: ${order.product} ${order.product_type ? `(${order.product_type})` : ''}
      Quantity: ${order.quantity}
      Unit Price: ${order.unit_price}
      Total: ${order.total_amount}
      Date: ${new Date(order.order_date).toLocaleDateString()}
      Payment Status: ${order.payment_status}
    `;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const saveToLocalAccount = (order) => {
    // This would typically save to localStorage or IndexedDB
    localStorage.setItem(`sales-order-${order.id}`, JSON.stringify(order));
    
    toast({
      title: "Order Saved",
      description: "Sales order saved to your local account"
    });
  };
  
  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
        <SheetHeader className="pb-4">
          <SheetTitle>Sales Orders</SheetTitle>
          <SheetDescription>
            View and manage your sales orders
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          {/* Search and filters */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="relative flex-grow max-w-sm">
              <Input
                placeholder="Search orders..."
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
          
          {/* Orders table */}
          {loading ? (
            <div className="text-center py-8">Loading sales orders...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">View</TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('customer_name')}
                        >
                          Customer
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('product')}
                        >
                          Product
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('order_date')}
                        >
                          Date
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('total_amount')}
                        >
                          Total
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button 
                          className="flex items-center"
                          onClick={() => handleSort('payment_status')}
                        >
                          Status
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell>{order.customer_name}</TableCell>
                          <TableCell>{order.product} {order.product_type ? `(${order.product_type})` : ''}</TableCell>
                          <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                          <TableCell>{Number(order.total_amount).toLocaleString()} UGX</TableCell>
                          <TableCell>
                            <span 
                              className={
                                order.payment_status === 'paid' 
                                  ? 'text-green-600' 
                                  : order.payment_status === 'partially_paid' 
                                  ? 'text-amber-600' 
                                  : 'text-red-600'
                              }
                            >
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
                                <DropdownMenuItem onClick={() => shareByWhatsApp(order)}>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => shareByEmail(order)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => saveToLocalAccount(order)}>
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
                          No sales orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {salesOrders?.length || 0} sales orders
              </div>
            </>
          )}
          
          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
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
                  <p className={
                    selectedOrder.payment_status === 'paid' 
                      ? 'text-green-600' 
                      : selectedOrder.payment_status === 'partially_paid' 
                      ? 'text-amber-600' 
                      : 'text-red-600'
                  }>
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
                <Button size="sm" variant="outline" onClick={() => shareByEmail(selectedOrder)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByWhatsApp(selectedOrder)}>
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

export default SalesOrderList;
