
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ArrowUpDown, Download, CheckCircle2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for proforma invoices
const sampleProformas = [
  { 
    id: 'PI-2024-001', 
    quotation: 'QT-2024-001',
    date: '2024-05-15', 
    customer: 'Starbucks Corp.', 
    amount: '$45,000', 
    status: 'Pending Payment',
    items: '3 items', 
    dueDate: '2024-06-15' 
  },
  { 
    id: 'PI-2024-002', 
    quotation: 'QT-2024-003',
    date: '2024-05-14', 
    customer: 'Dunkin Donuts', 
    amount: '$28,750', 
    status: 'Confirmed',
    items: '4 items', 
    dueDate: '2024-06-14' 
  },
  { 
    id: 'PI-2024-003', 
    quotation: 'QT-2024-004',
    date: '2024-05-12', 
    customer: 'Peet\'s Coffee', 
    amount: '$36,200', 
    status: 'Draft',
    items: '3 items', 
    dueDate: '2024-06-12' 
  },
  { 
    id: 'PI-2024-004', 
    quotation: 'QT-2024-005',
    date: '2024-05-10', 
    customer: 'Blue Bottle Coffee', 
    amount: '$41,500', 
    status: 'Pending Payment',
    items: '5 items', 
    dueDate: '2024-06-10' 
  }
];

const ProformaList = ({ onCreateNew }) => {
  const [proformas] = useState(sampleProformas);
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
      'Pending Payment': 'bg-blue-100 text-blue-800 border-blue-200',
      'Confirmed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
      'Expired': 'bg-amber-100 text-amber-800 border-amber-200'
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
                Proforma #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('quotation')}>
                Quotation #
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
            <TableHead>Items</TableHead>
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
          {proformas.map((proforma) => (
            <TableRow key={proforma.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{proforma.id}</TableCell>
              <TableCell>{proforma.quotation}</TableCell>
              <TableCell>{proforma.date}</TableCell>
              <TableCell>{proforma.customer}</TableCell>
              <TableCell>{proforma.amount}</TableCell>
              <TableCell>{proforma.items}</TableCell>
              <TableCell>{proforma.dueDate}</TableCell>
              <TableCell>{renderStatusBadge(proforma.status)}</TableCell>
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
                        Mark as Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Convert to Order
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
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

export default ProformaList;
