import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const InventoryTable = ({ items, itemStatuses, getStatusColor, handleStatusChange, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  console.log('Rendering InventoryTable with items:', items);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUrgencyColor = (urgency = 'medium') => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[urgency.toLowerCase()] || colors.medium;
  };

  const generateSerialNumbers = (item) => {
    // Get first two letters of item name, convert to uppercase
    const prefix = item.item_name.substring(0, 2).toUpperCase();
    // Generate array of serial numbers based on quantity
    return Array.from({ length: item.quantity }, (_, index) => 
      `${prefix}${String(item.id).padStart(3, '0')}-${String(index + 1).padStart(3, '0')}`
    );
  };

  if (isLoading) {
    return <div>Loading inventory items...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{item.item_name}</TableCell>
              <TableCell>{item.section}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="hover:bg-gray-100">
                      {item.quantity}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Serial Numbers for {item.item_name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                      {generateSerialNumbers(item).map((serial, index) => (
                        <div key={serial} className="p-2 bg-gray-50 rounded flex justify-between">
                          <span className="font-medium">{index + 1}.</span>
                          <span>{serial}</span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
              <TableCell>{formatCurrency(item.total_cost)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgency)}`}>
                  {item.urgency || 'medium'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {itemStatuses[item.status]}
                </span>
              </TableCell>
              <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
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