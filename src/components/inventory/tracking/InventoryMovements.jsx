import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

const InventoryMovements = () => {
  const movements = [
    {
      id: 1,
      type: 'inbound',
      product: 'Fresh Milk',
      quantity: 500,
      unit: 'liters',
      location: 'Dairy Cooler A',
      timestamp: '2024-01-15T09:30:00Z',
      handler: 'John Doe'
    },
    {
      id: 2,
      type: 'outbound',
      product: 'Yogurt',
      quantity: 200,
      unit: 'units',
      location: 'Cold Storage B',
      timestamp: '2024-01-15T10:15:00Z',
      handler: 'Jane Smith'
    },
    {
      id: 3,
      type: 'transfer',
      product: 'Cheese',
      quantity: 100,
      unit: 'kg',
      location: 'Processing Unit C',
      timestamp: '2024-01-15T11:00:00Z',
      handler: 'Mike Johnson'
    }
  ];

  const getMovementIcon = (type) => {
    switch (type) {
      case 'inbound':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'outbound':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Movements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Handler</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getMovementIcon(movement.type)}
                    <span className="capitalize">{movement.type}</span>
                  </div>
                </TableCell>
                <TableCell>{movement.product}</TableCell>
                <TableCell>
                  {movement.quantity} {movement.unit}
                </TableCell>
                <TableCell>{movement.location}</TableCell>
                <TableCell>{movement.handler}</TableCell>
                <TableCell>
                  {new Date(movement.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryMovements;