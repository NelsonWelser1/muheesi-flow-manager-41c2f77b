import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const InventoryStatus = ({ data, isLoading }) => {
  if (isLoading) {
    return <div>Loading inventory status...</div>;
  }

  const getExpiryStatus = (date) => {
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="warning">Warning</Badge>;
    }
    return <Badge variant="success">Good</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Materials Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Expiry Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.material_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{getExpiryStatus(item.expiration_date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;