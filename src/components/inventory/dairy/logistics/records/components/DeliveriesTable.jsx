
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeliveriesTable = ({ deliveries, handleSort, sortConfig }) => {
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'In Transit':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Transit</Badge>;
      case 'Delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>;
      case 'Delayed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              onClick={() => handleSort('delivery_id')}
            >
              Delivery ID
              {renderSortIcon('delivery_id')}
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
              onClick={() => handleSort('scheduled_pickup_time')}
            >
              Pickup Time
              {renderSortIcon('scheduled_pickup_time')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('scheduled_delivery_time')}
            >
              Delivery Time
              {renderSortIcon('scheduled_delivery_time')}
            </TableHead>
            <TableHead>
              Locations
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status
              {renderSortIcon('status')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              Created
              {renderSortIcon('created_at')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{delivery.delivery_id}</TableCell>
              <TableCell>{delivery.customer_name}</TableCell>
              <TableCell>{formatDateTime(delivery.scheduled_pickup_time)}</TableCell>
              <TableCell>{formatDateTime(delivery.scheduled_delivery_time)}</TableCell>
              <TableCell>
                <div className="text-xs">
                  <div className="mb-1"><span className="font-semibold">From:</span> {delivery.pickup_location}</div>
                  <div><span className="font-semibold">To:</span> {delivery.delivery_location}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(delivery.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(delivery.created_at)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveriesTable;
