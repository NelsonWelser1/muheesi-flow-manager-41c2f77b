
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ChevronUp, ChevronDown } from "lucide-react";

const OrdersTable = ({ orders, handleSort, sortConfig }) => {
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'Confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'Normal':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Normal</Badge>;
      case 'Low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Format order details
  const formatOrderDetails = (details) => {
    if (!details) return 'No details';
    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch (error) {
        return details;
      }
    }
    
    if (Array.isArray(details)) {
      return `${details.length} items`;
    } else {
      return 'Order details';
    }
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('order_id')}
            >
              Order ID
              {renderSortIcon('order_id')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('customer_name')}
            >
              Customer
              {renderSortIcon('customer_name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('order_date_time')}
            >
              Order Date
              {renderSortIcon('order_date_time')}
            </TableHead>
            <TableHead>
              Details
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('delivery_priority')}
            >
              Priority
              {renderSortIcon('delivery_priority')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('order_status')}
            >
              Status
              {renderSortIcon('order_status')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              Created
              {renderSortIcon('created_at')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{order.order_id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{formatDateTime(order.order_date_time)}</TableCell>
              <TableCell>
                <div className="text-xs">
                  {formatOrderDetails(order.order_details)}
                </div>
              </TableCell>
              <TableCell>{getPriorityBadge(order.delivery_priority)}</TableCell>
              <TableCell>{getStatusBadge(order.order_status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(order.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
