import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";

const OrdersTable = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input type="checkbox" className="rounded border-gray-300" />
          </TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Fulfillment</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <input type="checkbox" className="rounded border-gray-300" />
            </TableCell>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              <Badge variant={order.status === 'pending' ? 'warning' : 'success'}>
                {order.status === 'pending' ? 'Pending' : 'Success'}
              </Badge>
            </TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell>{order.delivery}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>
              <Badge variant={order.fulfillment === 'Unfulfilled' ? 'destructive' : 'success'}>
                {order.fulfillment}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;