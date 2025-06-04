import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  Package,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

const SalesOrderList = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { salesOrders, isLoading, deleteSalesOrder } = useSalesOrders();
  const { toast } = useToast();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const { success, error } = await deleteSalesOrder(orderId);
      if (success) {
        toast({
          title: "Success",
          description: "Sales order deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete sales order",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = salesOrders?.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const totalRevenue = filteredOrders.reduce((sum, order) => 
    sum + (order.quantity * order.unit_price - (order.discount || 0)), 0
  );

  const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sales Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {order.customer_name}</p>
                <p><strong>Order Date:</strong> {order.order_date}</p>
                <p><strong>Sales Rep:</strong> {order.sales_rep || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Details</h4>
                <p><strong>Product:</strong> {order.product}</p>
                <p><strong>Type:</strong> {order.product_type}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p><strong>Unit Price:</strong> ${order.unit_price}</p>
                <p><strong>Discount:</strong> ${order.discount || 0}</p>
                <p><strong>Total:</strong> ${(order.quantity * order.unit_price - (order.discount || 0)).toFixed(2)}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Badge className={getStatusColor(order.payment_status)}>
                  {order.payment_status}
                </Badge>
                <p className="mt-2"><strong>Delivery:</strong> {order.delivery_required}</p>
              </div>
            </div>

            {order.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">{order.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sales Orders Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{filteredOrders.length}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {filteredOrders.filter(o => o.payment_status === 'completed').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {filteredOrders.filter(o => o.payment_status === 'pending').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <Tabs defaultValue="all" onValueChange={setFilterStatus}>
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading sales orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sales orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{order.customer_name}</span>
                              <Badge className={getStatusColor(order.payment_status)}>
                                {getStatusIcon(order.payment_status)}
                                <span className="ml-1">{order.payment_status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Product</p>
                                <p className="font-medium">{order.product} - {order.product_type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Unit Price</p>
                                <p className="font-medium">${order.unit_price}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-green-600">
                                  ${(order.quantity * order.unit_price - (order.discount || 0)).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {order.order_date}
                              </div>
                              {order.sales_rep && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {order.sales_rep}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Delivery: {order.delivery_required}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading sales orders...</p>
                </div>
              ) : filteredOrders.filter(o => o.payment_status === 'pending').length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending sales orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.filter(o => o.payment_status === 'pending').map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{order.customer_name}</span>
                              <Badge className={getStatusColor(order.payment_status)}>
                                {getStatusIcon(order.payment_status)}
                                <span className="ml-1">{order.payment_status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Product</p>
                                <p className="font-medium">{order.product} - {order.product_type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Unit Price</p>
                                <p className="font-medium">${order.unit_price}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-green-600">
                                  ${(order.quantity * order.unit_price - (order.discount || 0)).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {order.order_date}
                              </div>
                              {order.sales_rep && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {order.sales_rep}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Delivery: {order.delivery_required}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading sales orders...</p>
                </div>
              ) : filteredOrders.filter(o => o.payment_status === 'completed').length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No completed sales orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.filter(o => o.payment_status === 'completed').map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{order.customer_name}</span>
                              <Badge className={getStatusColor(order.payment_status)}>
                                {getStatusIcon(order.payment_status)}
                                <span className="ml-1">{order.payment_status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Product</p>
                                <p className="font-medium">{order.product} - {order.product_type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Unit Price</p>
                                <p className="font-medium">${order.unit_price}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-green-600">
                                  ${(order.quantity * order.unit_price - (order.discount || 0)).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {order.order_date}
                              </div>
                              {order.sales_rep && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {order.sales_rep}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Delivery: {order.delivery_required}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading sales orders...</p>
                </div>
              ) : filteredOrders.filter(o => o.payment_status === 'cancelled').length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No cancelled sales orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.filter(o => o.payment_status === 'cancelled').map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{order.customer_name}</span>
                              <Badge className={getStatusColor(order.payment_status)}>
                                {getStatusIcon(order.payment_status)}
                                <span className="ml-1">{order.payment_status}</span>
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Product</p>
                                <p className="font-medium">{order.product} - {order.product_type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Quantity</p>
                                <p className="font-medium">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Unit Price</p>
                                <p className="font-medium">${order.unit_price}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-green-600">
                                  ${(order.quantity * order.unit_price - (order.discount || 0)).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {order.order_date}
                              </div>
                              {order.sales_rep && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {order.sales_rep}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Delivery: {order.delivery_required}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal 
          order={selectedOrder} 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default SalesOrderList;
