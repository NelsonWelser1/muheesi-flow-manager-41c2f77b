
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ArrowUpDown, Download, CheckCircle2, FileClock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for invoices
const sampleInvoices = [
  { 
    id: 'INV-2024-001', 
    order: 'ORD-2024-002',
    date: '2024-05-16', 
    customer: 'Starbucks Corp.', 
    amount: '$45,000',
    dueDate: '2024-06-16',
    status: 'Paid'
  },
  { 
    id: 'INV-2024-002', 
    order: 'ORD-2024-001',
    date: '2024-05-15', 
    customer: 'Dunkin Donuts', 
    amount: '$28,750',
    dueDate: '2024-06-15',
    status: 'Pending'
  },
  { 
    id: 'INV-2024-003', 
    order: 'ORD-2024-003',
    date: '2024-05-12', 
    customer: 'Blue Bottle Coffee', 
    amount: '$41,500',
    dueDate: '2024-06-12',
    status: 'Draft'
  },
  { 
    id: 'INV-2024-004', 
    order: 'ORD-2024-004',
    date: '2024-04-28', 
    customer: 'Peet\'s Coffee', 
    amount: '$36,200',
    dueDate: '2024-05-28',
    status: 'Overdue'
  }
];

const InvoicesList = ({ onCreateNew }) => {
  const [invoices] = useState(sampleInvoices);
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
      'Pending': 'bg-blue-100 text-blue-800 border-blue-200',
      'Paid': 'bg-green-100 text-green-800 border-green-200',
      'Overdue': 'bg-red-100 text-red-800 border-red-200',
      'Partially Paid': 'bg-amber-100 text-amber-800 border-amber-200'
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
            <TableHead className="w-[120px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                Invoice #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('order')}>
                Order #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('date')}>
                Issue Date
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
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('dueDate')}>
                Due Date
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.order}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
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
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileClock className="h-4 w-4 mr-2" />
                        Send Payment Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Void Invoice
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

export default InvoicesList;
