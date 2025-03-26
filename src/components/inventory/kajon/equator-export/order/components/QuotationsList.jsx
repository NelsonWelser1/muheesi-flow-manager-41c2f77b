
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ArrowUpDown, Download } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for quotations
const sampleQuotations = [
  { 
    id: 'QT-2024-001', 
    date: '2024-05-15', 
    customer: 'Starbucks Corp.', 
    amount: '$45,000', 
    status: 'Sent',
    items: '3 items', 
    expiry: '2024-06-15' 
  },
  { 
    id: 'QT-2024-002', 
    date: '2024-05-14', 
    customer: 'Costa Coffee', 
    amount: '$32,500', 
    status: 'Draft',
    items: '2 items', 
    expiry: '2024-06-14' 
  },
  { 
    id: 'QT-2024-003', 
    date: '2024-05-12', 
    customer: 'Dunkin Donuts', 
    amount: '$28,750', 
    status: 'Accepted',
    items: '4 items', 
    expiry: '2024-06-12' 
  },
  { 
    id: 'QT-2024-004', 
    date: '2024-05-10', 
    customer: 'Peet\'s Coffee', 
    amount: '$36,200', 
    status: 'Sent',
    items: '3 items', 
    expiry: '2024-06-10' 
  },
  { 
    id: 'QT-2024-005', 
    date: '2024-05-08', 
    customer: 'Blue Bottle Coffee', 
    amount: '$41,500', 
    status: 'Rejected',
    items: '5 items', 
    expiry: '2024-06-08' 
  },
];

const QuotationsList = ({ onCreateNew }) => {
  const [quotations] = useState(sampleQuotations);
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
      'Sent': 'bg-blue-100 text-blue-800 border-blue-200',
      'Accepted': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
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
            <TableHead className="w-[120px]">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                Quote #
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
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('expiry')}>
                Expiry
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quote) => (
            <TableRow key={quote.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{quote.id}</TableCell>
              <TableCell>{quote.date}</TableCell>
              <TableCell>{quote.customer}</TableCell>
              <TableCell>{quote.amount}</TableCell>
              <TableCell>{quote.items}</TableCell>
              <TableCell>{quote.expiry}</TableCell>
              <TableCell>{renderStatusBadge(quote.status)}</TableCell>
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
                        Convert to Proforma
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

export default QuotationsList;
