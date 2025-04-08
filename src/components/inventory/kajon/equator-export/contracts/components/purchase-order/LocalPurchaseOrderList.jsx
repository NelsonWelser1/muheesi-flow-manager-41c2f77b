
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Eye, FileText, Download, Trash2, RefreshCcw } from 'lucide-react';
import { useLocalPurchaseAgreements } from '@/hooks/useLocalPurchaseAgreements';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const LocalPurchaseOrderList = ({ onNewOrder, onViewOrder, onEditOrder }) => {
  const { toast } = useToast();
  const { fetchAgreements, deleteAgreement, loading } = useLocalPurchaseAgreements();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    const filters = {
      ...(statusFilter && { status: statusFilter }),
      ...(searchTerm && { search: searchTerm })
    };
    
    const result = await fetchAgreements(filters);
    if (result.success) {
      setOrders(result.data || []);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };
  
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    // Re-fetch with the new filter
    fetchAgreements({ status: value, search: searchTerm }).then(result => {
      if (result.success) {
        setOrders(result.data || []);
      }
    });
  };
  
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    const result = await deleteAgreement(orderToDelete.id);
    if (result.success) {
      // Remove from local state to avoid re-fetching
      setOrders(prevOrders => 
        prevOrders.filter(o => o.id !== orderToDelete.id)
      );
      setOrderToDelete(null);
      
      toast({
        title: "Success",
        description: "Purchase order deleted successfully",
      });
    }
  };
  
  const handleRefresh = () => {
    loadOrders();
    toast({
      title: "Refreshed",
      description: "Purchase order list has been refreshed",
    });
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString || 'N/A';
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value || 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Local Purchase Orders</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Select 
            value={statusFilter}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search orders..." 
                className="pl-8 w-40 sm:w-64" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={onNewOrder}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Order</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading purchase orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {searchTerm || statusFilter 
                        ? "No orders match your search criteria" 
                        : "No purchase orders found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.contract_number}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.agreement_date)}
                      </TableCell>
                      <TableCell>
                        <div>{order.supplier_name}</div>
                        {order.supplier_contact && (
                          <div className="text-xs text-gray-500">{order.supplier_contact}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.items && order.items.length > 0 ? (
                          <div className="text-sm">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index}>
                                {item.description || 'Unnamed item'} ({item.quantity || 0} {item.unit || 'Kg'})
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No items</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(order.total_value)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.contract_status] || statusColors.draft}>
                          {order.contract_status.charAt(0).toUpperCase() + order.contract_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="View Order"
                            onClick={() => onViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Edit Order"
                            onClick={() => onEditOrder(order)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Delete Order"
                                onClick={() => setOrderToDelete(order)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete purchase order #{order.contract_number}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalPurchaseOrderList;
