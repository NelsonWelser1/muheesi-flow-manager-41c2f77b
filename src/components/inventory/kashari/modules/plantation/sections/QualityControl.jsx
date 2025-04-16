
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const QualityControl = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Control Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Inspection Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>BCH001</TableCell>
              <TableCell>Bananas (Ripe)</TableCell>
              <TableCell className="text-green-600">A</TableCell>
              <TableCell>2025-04-16</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>BCH002</TableCell>
              <TableCell>Bananas (Green)</TableCell>
              <TableCell className="text-green-600">A</TableCell>
              <TableCell>2025-04-16</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QualityControl;
