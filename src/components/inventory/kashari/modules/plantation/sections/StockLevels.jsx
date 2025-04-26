
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const StockLevels = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Bananas</TableCell>
              <TableCell>250</TableCell>
              <TableCell>Bunches</TableCell>
              <TableCell className="text-green-600">Optimal</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maize</TableCell>
              <TableCell>1.5</TableCell>
              <TableCell>Tonnes</TableCell>
              <TableCell className="text-amber-600">Moderate</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beans</TableCell>
              <TableCell>500</TableCell>
              <TableCell>Kgs</TableCell>
              <TableCell className="text-green-600">Optimal</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StockLevels;
