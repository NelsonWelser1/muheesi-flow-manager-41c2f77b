import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Printer, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { format } from 'date-fns';

const SalesOrderList = () => {
  const { toast } = useToast();
  const { salesOrders, loading, fetchSalesOrders, deleteSalesOrder } = useSalesOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchSalesOrders();
  }, [fetchSalesOrders]);

  useEffect(() => {
    let filtered = salesOrders || [];
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [salesOrders, searchTerm, statusFilter]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteSalesOrder(orderId);
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sales order",
        variant: "destructive",
      });
    }
  };

  const printSalesOrders = () => {
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent(filteredOrders);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const printSingleOrder = (order) => {
    const printWindow = window.open('', '_blank');
    const printContent = generateSingleOrderPrintContent(order);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const generatePrintContent = (orders) => {
    const currentDate = new Date().toLocaleString();
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    return `
      <!DOCTYPE html>
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
            .company-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb;
              margin-bottom: 5px;
            }
            .report-title { 
              font-size: 20px; 
              margin: 10px 0; 
            }
            .report-meta { 
              font-size: 12px; 
              color: #666; 
              margin-bottom: 20px;
            }
            .summary-section {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 25px;
              border: 1px solid #dee2e6;
            }
            .summary-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #495057;
            }
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
            }
            .stat-box {
              text-align: center;
              padding: 10px;
              background: white;
              border-radius: 3px;
              border: 1px solid #e9ecef;
            }
            .stat-value {
              font-size: 18px;
              font-weight: bold;
              color: #2563eb;
            }
            .stat-label {
              font-size: 12px;
              color: #6c757d;
              margin-top: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f8f9fa; 
              font-weight: bold;
              color: #495057;
            }
            tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            .status-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .status-confirmed { background-color: #d4edda; color: #155724; }
            .status-shipped { background-color: #d1ecf1; color: #0c5460; }
            .status-delivered { background-color: #d1e7dd; color: #0f5132; }
            .status-cancelled { background-color: #f8d7da; color: #721c24; }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 10px;
              color: #6c757d;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Grand Berna Dairies</div>
            <div class="report-title">Sales Orders Report</div>
            <div class="report-meta">Generated on: ${currentDate}</div>
          </div>
          
          <div class="summary-section">
            <div class="summary-title">Report Summary</div>
            <div class="summary-stats">
              <div class="stat-box">
                <div class="stat-value">${totalOrders}</div>
                <div class="stat-label">Total Orders</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">$${totalValue.toFixed(2)}</div>
                <div class="stat-label">Total Value</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">$${totalOrders > 0 ? (totalValue / totalOrders).toFixed(2) : '0.00'}</div>
                <div class="stat-label">Average Order Value</div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.order_number || 'N/A'}</td>
                  <td>${order.customer_name || 'N/A'}</td>
                  <td>${order.product_name || 'N/A'}</td>
                  <td>${order.quantity || 0}</td>
                  <td>$${(order.price_per_unit || 0).toFixed(2)}</td>
                  <td>$${(order.total_amount || 0).toFixed(2)}</td>
                  <td><span class="status-badge status-${order.order_status || 'pending'}">${order.order_status || 'Pending'}</span></td>
                  <td>${order.order_date ? format(new Date(order.order_date), 'MMM dd, yyyy') : 'N/A'}</td>
                  <td>${order.delivery_date ? format(new Date(order.delivery_date), 'MMM dd, yyyy') : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report contains ${totalOrders} sales order(s) • Generated by Sales Management System</p>
            <p>Confidential - For internal use only</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateSingleOrderPrintContent = (order) => {
    const currentDate = new Date().toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Order - ${order.order_number}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb;
              margin-bottom: 5px;
            }
            .order-title { 
              font-size: 20px; 
              margin: 10px 0; 
            }
            .order-meta { 
              font-size: 12px; 
              color: #666; 
            }
            .order-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 30px 0;
            }
            .detail-section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              border: 1px solid #dee2e6;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #495057;
              border-bottom: 1px solid #dee2e6;
              padding-bottom: 5px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              color: #495057;
            }
            .detail-value {
              color: #333;
            }
            .status-badge {
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .status-confirmed { background-color: #d4edda; color: #155724; }
            .status-shipped { background-color: #d1ecf1; color: #0c5460; }
            .status-delivered { background-color: #d1e7dd; color: #0f5132; }
            .status-cancelled { background-color: #f8d7da; color: #721c24; }
            .total-section {
              background-color: #e3f2fd;
              padding: 20px;
              border-radius: 5px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #2196f3;
            }
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #1976d2;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 10px;
              color: #6c757d;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .order-details { grid-template-columns: 1fr; gap: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Grand Berna Dairies</div>
            <div class="order-title">Sales Order Details</div>
            <div class="order-meta">Order #: ${order.order_number || 'N/A'} • Generated on: ${currentDate}</div>
          </div>
          
          <div class="order-details">
            <div class="detail-section">
              <div class="section-title">Order Information</div>
              <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span class="detail-value">${order.order_number || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">${order.order_date ? format(new Date(order.order_date), 'MMMM dd, yyyy') : 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Delivery Date:</span>
                <span class="detail-value">${order.delivery_date ? format(new Date(order.delivery_date), 'MMMM dd, yyyy') : 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge status-${order.order_status || 'pending'}">${order.order_status || 'Pending'}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="section-title">Customer Information</div>
              <div class="detail-row">
                <span class="detail-label">Customer Name:</span>
                <span class="detail-value">${order.customer_name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact:</span>
                <span class="detail-value">${order.customer_contact || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${order.delivery_address || 'N/A'}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="section-title">Product Information</div>
              <div class="detail-row">
                <span class="detail-label">Product:</span>
                <span class="detail-value">${order.product_name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${order.quantity || 0}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Unit Price:</span>
                <span class="detail-value">$${(order.price_per_unit || 0).toFixed(2)}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="section-title">Additional Details</div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${order.payment_method || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Special Instructions:</span>
                <span class="detail-value">${order.special_instructions || 'None'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${order.notes || 'None'}</span>
              </div>
            </div>
          </div>
          
          <div class="total-section">
            <div>Total Order Amount</div>
            <div class="total-amount">$${(order.total_amount || 0).toFixed(2)}</div>
          </div>
          
          <div class="footer">
            <p>Sales Order Details • Generated by Sales Management System</p>
            <p>Confidential - For internal use only</p>
          </div>
        </body>
      </html>
    `;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading sales orders...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sales Orders</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={printSalesOrders}
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print All Orders
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, order number, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sales orders found.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.product_name}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${(order.total_amount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.order_status)}>
                          {order.order_status || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.order_date ? format(new Date(order.order_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => printSingleOrder(order)}
                            className="flex items-center gap-1"
                          >
                            <Printer className="h-3 w-3" />
                            Print
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderList;
