
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Eye, Pencil, Loader } from "lucide-react";
import { format } from 'date-fns';
import { useLocalPurchaseOrders } from '@/hooks/useLocalPurchaseOrders';
import { runLocalPurchaseAgreementMigration } from '@/integrations/supabase/hooks/runMigration';

const LocalPurchaseOrderList = ({ 
  orders = [], 
  loading = false, 
  onNewOrder, 
  onViewOrder, 
  onEditOrder 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchOrders } = useLocalPurchaseOrders();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeTable = async () => {
    setIsInitializing(true);
    try {
      await runLocalPurchaseAgreementMigration();
      await fetchOrders();
    } catch (error) {
      console.error('Error initializing table:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      if (filter !== 'all') {
        return order.contract_status === filter;
      }
      return true;
    })
    .filter(order => {
      if (searchTerm) {
        return (
          (order.contract_number && order.contract_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.supplier_name && order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.buyer_name && order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return true;
    });

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Local Purchase Orders</CardTitle>
        <Button onClick={onNewOrder}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search purchase orders..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading || isInitializing ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-500">Loading purchase orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No purchase orders found</p>
            {orders.length === 0 && (
              <Button onClick={handleInitializeTable} disabled={isInitializing}>
                {isInitializing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  'Initialize Purchase Orders Table'
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.contract_number}</TableCell>
                    <TableCell>{order.supplier_name}</TableCell>
                    <TableCell>{formatDate(order.agreement_date)}</TableCell>
                    <TableCell>{formatCurrency(order.total_value)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.contract_status)}`}>
                        {order.contract_status?.charAt(0).toUpperCase() + order.contract_status?.slice(1) || 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEditOrder(order)}>
                          <Pencil className="h-4 w-4" />
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
  );
};

export default LocalPurchaseOrderList;
