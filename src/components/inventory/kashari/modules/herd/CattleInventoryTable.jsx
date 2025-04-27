import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCattleInventory } from '@/hooks/useCattleInventory';

const CattleInventoryTable = () => {
  const { cattleList, isLoading, error } = useCattleInventory();

  if (isLoading) return <div>Loading cattle inventory...</div>;
  if (error) return <div>Error loading cattle inventory: {error.message}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tag Number</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Breed</TableHead>
          <TableHead>Health Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cattleList.map((cattle) => (
          <TableRow key={cattle.id}>
            <TableCell className="font-medium">{cattle.tag_number}</TableCell>
            <TableCell>{cattle.name || 'N/A'}</TableCell>
            <TableCell>{cattle.type}</TableCell>
            <TableCell>{cattle.breed}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  cattle.health_status === 'good' ? 'default' : 
                  cattle.health_status === 'critical' ? 'destructive' : 'secondary'
                }
              >
                {cattle.health_status}
              </Badge>
            </TableCell>
            <TableCell>
              {/* Add action buttons if needed */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CattleInventoryTable;
