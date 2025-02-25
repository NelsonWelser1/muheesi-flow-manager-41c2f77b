
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const InventoryStatus = ({ inventory }) => {
  const getExpiryStatus = (expirationDate) => {
    const daysUntilExpiry = Math.ceil((new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'bg-red-500' };
    if (daysUntilExpiry < 7) return { label: 'Expiring Soon', color: 'bg-yellow-500' };
    return { label: 'Good', color: 'bg-green-500' };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Batch Number</TableHead>
            <TableHead>Expiry Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory?.map((item) => {
            const status = getExpiryStatus(item.expiration_date);
            return (
              <TableRow key={item.id}>
                <TableCell>{item.material_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.batch_number}</TableCell>
                <TableCell>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryStatus;
