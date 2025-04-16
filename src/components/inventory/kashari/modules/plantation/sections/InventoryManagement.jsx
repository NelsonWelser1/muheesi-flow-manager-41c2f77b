
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const InventoryManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Entry
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Bananas (Ripe)</TableCell>
                <TableCell>250 Bunches</TableCell>
                <TableCell>Warehouse A</TableCell>
                <TableCell>2025-04-16</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bananas (Green)</TableCell>
                <TableCell>430 Bunches</TableCell>
                <TableCell>Warehouse B</TableCell>
                <TableCell>2025-04-16</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
