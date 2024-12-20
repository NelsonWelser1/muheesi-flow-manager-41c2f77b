import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProductionSchedule = ({ data, isLoading }) => {
  if (isLoading) {
    return <div>Loading production schedule...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Number</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Raw Material Used</TableHead>
              <TableHead>Quality Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.batch_number}</TableCell>
                <TableCell>{item.product_type}</TableCell>
                <TableCell>{item.raw_material_used} liters</TableCell>
                <TableCell>{item.quality_status}</TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductionSchedule;