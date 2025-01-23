import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const urgencyLevels = {
  'critical': 'Critical',
  'high': 'High',
  'medium': 'Medium',
  'medium-low': 'Medium-Low',
  'low': 'Low'
};

const InventoryTable = ({ items, itemStatuses, getStatusColor, handleStatusChange, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
      critical: 'bg-red-600 text-white',
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      'medium-low': 'bg-blue-100 text-blue-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[urgency.toLowerCase()] || colors.medium;
  };

  const generateSerialNumbers = (item, baseIndex) => {
    const prefix = item.item_name.substring(0, 2).toUpperCase();
    return Array.from({ length: item.quantity }, (_, idx) => {
      const paddedId = String(baseIndex + idx + 1).padStart(5, '0');
      return `${prefix}${paddedId}`;
    });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const findDuplicateItems = (items) => {
    const itemGroups = {};
    items.forEach(item => {
      const key = item.item_name.trim().toLowerCase();
      if (!itemGroups[key]) {
        itemGroups[key] = [];
      }
      itemGroups[key].push(item);
    });
    return itemGroups;
  };

  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  const duplicateGroups = findDuplicateItems(sortedItems);
  const processedItems = new Set();

  if (isLoading) {
    return <div>Loading inventory items...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead onClick={() => handleSort('item_name')} className="cursor-pointer hover:bg-gray-50">
              Item Name {sortConfig.key === 'item_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('section')} className="cursor-pointer hover:bg-gray-50">
              Section {sortConfig.key === 'section' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer hover:bg-gray-50">
              Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('unit_cost')} className="cursor-pointer hover:bg-gray-50">
              Unit Cost {sortConfig.key === 'unit_cost' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('total_cost')} className="cursor-pointer hover:bg-gray-50">
              Total Cost {sortConfig.key === 'total_cost' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('urgency')} className="cursor-pointer hover:bg-gray-50">
              Urgency {sortConfig.key === 'urgency' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('status')} className="cursor-pointer hover:bg-gray-50">
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer hover:bg-gray-50">
              Purchase Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems?.map((item, index) => {
            const itemKey = item.item_name.trim().toLowerCase();
            const duplicateItems = duplicateGroups[itemKey] || [];
            const isOverlapping = duplicateItems.length > 1;
            
            // Skip if we've already processed this item group
            if (isOverlapping && processedItems.has(itemKey)) {
              return null;
            }
            
            // Mark this item group as processed
            processedItems.add(itemKey);

            return (
              <TableRow 
                key={item.id}
                className={isOverlapping ? 'relative border-l-4 border-l-blue-400 hover:bg-gray-50' : ''}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.item_name}
                    {isOverlapping && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {duplicateItems.length} entries
                      </Badge>
                    )}
                  </div>
                </TableCell>
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
                        {generateSerialNumbers(item, index).map((serial, idx) => (
                          <div key={serial} className="p-2 bg-gray-50 rounded flex justify-between">
                            <span className="font-medium">Serial Number {idx + 1}:</span>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgency)}`}>
                        {urgencyLevels[item.urgency] || 'Medium'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {Object.entries(urgencyLevels).map(([key, label]) => (
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {itemStatuses[item.status]}
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
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="hover:bg-gray-100">
                        {new Date(item.created_at).toLocaleDateString()}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Purchase History for {item.item_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {duplicateItems.map((entry, idx) => (
                          <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                            <p className="mb-2"><span className="font-medium">Purchase Date:</span> {new Date(entry.created_at).toLocaleString()}</p>
                            <p className="mb-2"><span className="font-medium">Batch ID:</span> {`BATCH-${new Date(entry.created_at).toISOString().split('T')[0]}-${idx + 1}`}</p>
                            <p><span className="font-medium">Quantity Added:</span> {entry.quantity} units</p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;