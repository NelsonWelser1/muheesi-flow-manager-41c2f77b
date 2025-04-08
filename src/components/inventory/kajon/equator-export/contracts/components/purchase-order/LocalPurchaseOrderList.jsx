
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Eye, Edit, Download, Trash2 } from "lucide-react";
import { useLocalPurchaseOrders } from '@/hooks/useLocalPurchaseOrders';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import ContractActionButton from '../ContractActionButton';

const LocalPurchaseOrderList = ({ onNewOrder, onViewOrder, onEditOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, loading, fetchOrders, deleteOrder } = useLocalPurchaseOrders();
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };
    
    loadOrders();
  }, [fetchOrders]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchOrders({ search: searchQuery });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      const result = await deleteOrder(id);
      
      if (result.success) {
        await fetchOrders(); // Refresh the list
      }
    }
  };

  const handleExportOrder = (order) => {
    // For now, just show a toast that this feature is not implemented
    toast({
      title: "Export Feature",
      description: "Export functionality will be implemented in a future update.",
    });
  };

  const contractStatusColors = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Local Purchase Orders</h2>
        <Button 
          onClick={onNewOrder}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Purchase Order
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Orders</CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by supplier or #..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" size="sm">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading purchase orders...</div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.contract_number}</TableCell>
                      <TableCell>
                        {order.agreement_date ? format(new Date(order.agreement_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div>{order.supplier_name}</div>
                        <div className="text-xs text-gray-500">{order.supplier_contact}</div>
                      </TableCell>
                      <TableCell>
                        {order.items && Array.isArray(order.items) ? 
                          `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}` : 
                          'No items'}
                      </TableCell>
                      <TableCell>
                        {typeof order.total_value === 'number' ? 
                          order.total_value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2
                          }) : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={contractStatusColors[order.contract_status] || contractStatusColors.draft}>
                          {order.contract_status ? order.contract_status.charAt(0).toUpperCase() + order.contract_status.slice(1) : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => onViewOrder(order)} title="View Order">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onEditOrder(order)} title="Edit Order">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleExportOrder(order)} title="Export Order">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)} title="Delete Order">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No Purchase Orders</h3>
              <p className="text-gray-500 mb-4">Create your first purchase order to get started</p>
              <Button onClick={onNewOrder} className="flex items-center gap-1 mx-auto">
                <Plus className="h-4 w-4" />
                New Purchase Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalPurchaseOrderList;
