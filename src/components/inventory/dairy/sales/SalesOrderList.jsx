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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, Eye, Printer, X } from "lucide-react";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { format } from 'date-fns';

const SalesOrderList = ({ onViewOrder, searchTerm, onSearchChange }) => {
  const { salesOrders, loading, error, fetchSalesOrders } = useSalesOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showOrdersList, setShowOrdersList] = useState(false);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  useEffect(() => {
    let filtered = [...salesOrders];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customer_name?.toLowerCase().includes(searchLower) ||
        order.product?.toLowerCase().includes(searchLower) ||
        order.product_type?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date_time || a.created_at);
      const dateB = new Date(b.date_time || b.created_at);
      
      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'customer-asc':
          return (a.customer_name || '').localeCompare(b.customer_name || '');
        case 'customer-desc':
          return (b.customer_name || '').localeCompare(a.customer_name || '');
        default:
          return dateB - dateA;
      }
    });

    setFilteredOrders(filtered);
  }, [salesOrders, searchTerm, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status || 'pending'}
      </Badge>
    );
  };

  const handlePrintOrders = () => {
    const printContent = `
      <html>
        <head>
          <title>Sales Orders Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .print-date { 
              text-align: right; 
              font-size: 12px; 
              margin-bottom: 10px; 
              color: #666;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
              font-size: 12px;
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold; 
            }
            .status-badge {
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-confirmed { background-color: #dbeafe; color: #1e40af; }
            .status-processing { background-color: #fed7aa; color: #c2410c; }
            .status-completed { background-color: #dcfce7; color: #166534; }
            .status-cancelled { background-color: #fecaca; color: #dc2626; }
            .summary {
              margin-top: 20px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <div class="header">
            <h2>Sales Orders Report</h2>
            <p>Total Orders: ${filteredOrders.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order.date_time ? format(new Date(order.date_time), 'PPp') : 'N/A'}</td>
                  <td>${order.customer_name || 'N/A'}</td>
                  <td>${order.product || 'N/A'}</td>
                  <td>${order.product_type || 'N/A'}</td>
                  <td>${order.quantity || 'N/A'}</td>
                  <td>UGX ${order.price_per_unit ? order.price_per_unit.toLocaleString() : 'N/A'}</td>
                  <td>UGX ${order.quantity && order.price_per_unit ? (order.quantity * order.price_per_unit).toLocaleString() : 'N/A'}</td>
                  <td><span class="status-badge status-${order.order_status || 'pending'}">${order.order_status || 'pending'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Orders:</strong> ${filteredOrders.length}</p>
            <p><strong>Total Value:</strong> UGX ${filteredOrders.reduce((sum, order) => sum + ((order.quantity || 0) * (order.price_per_unit || 0)), 0).toLocaleString()}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading sales orders: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  // If orders list is not shown, display only the button
  if (!showOrdersList) {
    return (
      <div className="flex justify-center p-6">
        <Button 
          onClick={() => setShowOrdersList(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Sales Orders
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sales Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handlePrintOrders} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Orders
            </Button>
            <Button 
              onClick={() => setShowOrdersList(false)}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Hide
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="customer-asc">Customer A-Z</SelectItem>
              <SelectItem value="customer-desc">Customer Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Order Date</TableHead>
                <TableHead className="whitespace-nowrap">Customer</TableHead>
                <TableHead className="whitespace-nowrap">Product</TableHead>
                <TableHead className="whitespace-nowrap">Quantity</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No sales orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="whitespace-nowrap">
                      {order.date_time ? format(new Date(order.date_time), 'PPp') : 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.customer_name || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <div className="font-medium">{order.product || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.product_type || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.quantity || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {getStatusBadge(order.order_status)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewOrder && onViewOrder(order)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {salesOrders.length} orders
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOrderList;
