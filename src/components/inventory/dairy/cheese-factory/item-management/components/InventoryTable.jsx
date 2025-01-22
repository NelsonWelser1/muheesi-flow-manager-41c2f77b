import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const InventoryTable = ({ items, itemStatuses, getStatusColor, handleStatusChange }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.item_name}</TableCell>
              <TableCell>{item.section}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
              <TableCell>{formatCurrency(item.total_cost)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {itemStatuses[item.status]}
                </span>
              </TableCell>
              <TableCell>{item.notes}</TableCell>
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

export default InventoryTable;