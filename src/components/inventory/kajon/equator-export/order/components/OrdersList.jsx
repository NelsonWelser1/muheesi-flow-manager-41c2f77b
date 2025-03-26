
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ArrowUpDown, Download, CheckCircle2, FileText } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for orders
const sampleOrders = [
  { 
    id: 'ORD-2024-001', 
    proforma: 'PI-2024-002',
    date: '2024-05-15', 
    customer: 'Dunkin Donuts', 
    amount: '$28,750', 
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryStatus: 'Pending'
  },
  { 
    id: 'ORD-2024-002', 
    proforma: 'PI-2024-001',
    date: '2024-05-14', 
    customer: 'Starbucks Corp.', 
    amount: '$45,000', 
    status: 'Confirmed',
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped'
  },
  { 
    id: 'ORD-2024-003', 
    proforma: 'PI-2024-004',
    date: '2024-05-12', 
    customer: 'Blue Bottle Coffee', 
    amount: '$41,500', 
    status: 'Draft',
    paymentStatus: 'Unpaid',
    deliveryStatus: 'Pending'
  },
  { 
    id: 'ORD-2024-004', 
    proforma: 'PI-2024-003',
    date: '2024-05-10', 
    customer: 'Peet\'s Coffee', 
    amount: '$36,200', 
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    deliveryStatus: 'Cancelled'
  }
];

const OrdersList = ({ onCreateNew }) => {
  const [orders] = useState(sampleOrders);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusStyles = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Confirmed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
      'Completed': 'bg-purple-100 text-purple-800 border-purple-200'
    };

    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {status}
      </Badge>
    );
  };

  const renderPaymentStatusBadge = (status) => {
    const statusStyles = {
      'Paid': 'bg-green-100 text-green-800 border-green-200',
      'Unpaid': 'bg-amber-100 text-amber-800 border-amber-200',
      'Refunded': 'bg-red-100 text-red-800 border-red-200',
      'Partial': 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {status}
      </Badge>
    );
  };

  const renderDeliveryStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Shipped': 'bg-blue-100 text-blue-800 border-blue-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[130px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                Order #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('proforma')}>
                Proforma #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('date')}>
                Date
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('customer')}>
                Customer
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('amount')}>
                Amount
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.proforma}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{renderStatusBadge(order.status)}</TableCell>
              <TableCell>{renderPaymentStatusBadge(order.paymentStatus)}</TableCell>
              <TableCell>{renderDeliveryStatusBadge(order.deliveryStatus)}</TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-1 justify-end">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersList;
