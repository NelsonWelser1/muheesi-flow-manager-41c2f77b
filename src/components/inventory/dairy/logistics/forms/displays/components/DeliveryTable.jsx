
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import DeliveryStatusBadge from './DeliveryStatusBadge';
import DeliveryActionsMenu from './DeliveryActionsMenu';

const DeliveryTable = ({ filteredDeliveries, handleDelete, formatDate }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Delivery ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pickup Time</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Pickup Location</TableHead>
            <TableHead>Delivery Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDeliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">{delivery.delivery_id}</TableCell>
              <TableCell>{delivery.customer_name}</TableCell>
              <TableCell><DeliveryStatusBadge status={delivery.status} /></TableCell>
              <TableCell>{formatDate(delivery.scheduled_pickup_time)}</TableCell>
              <TableCell>{formatDate(delivery.scheduled_delivery_time)}</TableCell>
              <TableCell>{delivery.pickup_location}</TableCell>
              <TableCell>{delivery.delivery_location}</TableCell>
              <TableCell className="text-right">
                <DeliveryActionsMenu 
                  delivery={delivery} 
                  handleDelete={handleDelete} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryTable;
