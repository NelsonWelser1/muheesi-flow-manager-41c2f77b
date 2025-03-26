
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

// Sample data for packing lists
const samplePackingLists = [
  { 
    id: 'PL-2024-001', 
    deliveryNote: 'DN-2024-001',
    date: '2024-05-16', 
    customer: 'Starbucks Corp.', 
    items: '3 items (10 MT)',
    carrier: 'Maersk Line',
    packages: '400 bags',
    status: 'Verified'
  },
  { 
    id: 'PL-2024-002', 
    deliveryNote: 'DN-2024-002',
    date: '2024-05-15', 
    customer: 'Dunkin Donuts', 
    items: '4 items (8 MT)',
    carrier: 'ONE Line',
    packages: '320 bags',
    status: 'Draft'
  },
  { 
    id: 'PL-2024-003', 
    deliveryNote: 'DN-2024-003',
    date: '2024-04-28', 
    customer: 'Peet\'s Coffee', 
    items: '3 items (6 MT)',
    carrier: 'MSC',
    packages: '240 bags',
    status: 'Verified'
  },
  { 
    id: 'PL-2024-004', 
    deliveryNote: 'DN-2024-004',
    date: '2024-05-14', 
    customer: 'Blue Bottle Coffee', 
    items: '5 items (12 MT)',
    carrier: 'pending',
    packages: '480 bags',
    status: 'Pending'
  }
];

const PackingLists = ({ onCreateNew }) => {
  const [packingLists] = useState(samplePackingLists);
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
      'Verified': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
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
                Packing List #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('deliveryNote')}>
                Delivery Note #
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
            <TableHead>Items</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('packages')}>
                Packages
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packingLists.map((packingList) => (
            <TableRow key={packingList.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{packingList.id}</TableCell>
              <TableCell>{packingList.deliveryNote}</TableCell>
              <TableCell>{packingList.date}</TableCell>
              <TableCell>{packingList.customer}</TableCell>
              <TableCell>{packingList.items}</TableCell>
              <TableCell>{packingList.packages}</TableCell>
              <TableCell>{packingList.carrier}</TableCell>
              <TableCell>{renderStatusBadge(packingList.status)}</TableCell>
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
                        Mark as Verified
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Send to Customer
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

export default PackingLists;
