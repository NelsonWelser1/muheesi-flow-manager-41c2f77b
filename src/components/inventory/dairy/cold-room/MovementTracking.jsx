
import React, { useEffect, useState } from 'react';
import { useColdRoomInventory } from './hooks/useColdRoomInventory';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const MovementTracking = () => {
  const { inventoryItems, loading, error, fetchInventory } = useColdRoomInventory();
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'in', 'out'

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(inventoryItems);
    } else {
      setFilteredItems(
        inventoryItems.filter(item => 
          item.movement_action.toLowerCase() === filter
        )
      );
    }
  }, [inventoryItems, filter]);

  if (loading) return <div>Loading movement data...</div>;
  if (error) return <div>Error loading movements: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Movement History</h2>
        <div className="flex space-x-2">
          <Badge 
            className={`cursor-pointer ${filter === 'all' ? 'bg-primary' : 'bg-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </Badge>
          <Badge 
            className={`cursor-pointer ${filter === 'in' ? 'bg-green-600' : 'bg-secondary'}`}
            onClick={() => setFilter('in')}
          >
            Goods Receipt
          </Badge>
          <Badge 
            className={`cursor-pointer ${filter === 'out' ? 'bg-amber-600' : 'bg-secondary'}`}
            onClick={() => setFilter('out')}
          >
            Goods Issue
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Cold Room</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Operator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(item.storage_date_time), 'PPp')}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          item.movement_action.toLowerCase() === 'in' 
                            ? 'bg-green-600' 
                            : 'bg-amber-600'
                        }
                      >
                        {item.movement_action.toLowerCase() === 'in' ? 'Goods Receipt' : 'Goods Issue'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.product_type}
                      <span className="block text-xs text-muted-foreground capitalize">
                        {item.product_category}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.batch_id}
                      {item.production_batch_id && (
                        <span className="block text-xs text-muted-foreground">
                          Prod: {item.production_batch_id}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{item.cold_room_id}</TableCell>
                    <TableCell className="text-right">
                      {item.unit_quantity} × {item.unit_weight}kg
                    </TableCell>
                    <TableCell>{item.operator_id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No movement records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementTracking;
