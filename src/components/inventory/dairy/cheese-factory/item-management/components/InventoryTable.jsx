import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

const InventoryTable = ({ items, itemStatuses, handleStatusChange }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Procurement Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.id.slice(0, 8)}</TableCell>
              <TableCell>{item.item_name}</TableCell>
              <TableCell>{item.section}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit_cost}</TableCell>
              <TableCell>{item.total_cost}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {itemStatuses[item.status]}
                </span>
              </TableCell>
              <TableCell>{format(new Date(item.procurement_date), 'PPpp')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    {Object.entries(itemStatuses).map(([key, label]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleStatusChange(item.id, key)}
                        className="cursor-pointer"
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    good: 'bg-green-100 text-green-800',
    fair: 'bg-yellow-100 text-yellow-800',
    bad: 'bg-red-100 text-red-800',
    out: 'bg-gray-100 text-gray-800',
    repair: 'bg-blue-100 text-blue-800',
    used: 'bg-purple-100 text-purple-800',
    need: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default InventoryTable;