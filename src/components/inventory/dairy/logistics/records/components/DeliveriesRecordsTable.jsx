
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DeliveriesRecordsTable = ({ deliveries, handleSort, sortConfig }) => {
  // Function to format date
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  // Function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="inline h-4 w-4 ml-1" /> 
      : <ChevronDown className="inline h-4 w-4 ml-1" />;
  };

  // Generate sortable header
  const SortableHeader = ({ column, label }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(column)}
      </div>
    </TableHead>
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader column="delivery_id" label="Delivery ID" />
            <SortableHeader column="customer_name" label="Customer" />
            <SortableHeader column="pickup_location" label="Pickup Location" />
            <SortableHeader column="delivery_location" label="Delivery Location" />
            <SortableHeader column="scheduled_pickup_time" label="Scheduled Pickup" />
            <SortableHeader column="scheduled_delivery_time" label="Scheduled Delivery" />
            <SortableHeader column="status" label="Status" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No delivery records found
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{delivery.delivery_id}</TableCell>
                <TableCell>{delivery.customer_name}</TableCell>
                <TableCell>{delivery.pickup_location}</TableCell>
                <TableCell>{delivery.delivery_location}</TableCell>
                <TableCell>{formatDate(delivery.scheduled_pickup_time)}</TableCell>
                <TableCell>{formatDate(delivery.scheduled_delivery_time)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveriesRecordsTable;
