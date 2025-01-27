import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { format } from 'date-fns';

const MilkReceptionTable = () => {
  const { data: milkReception, isLoading, error } = useMilkReception();

  if (isLoading) {
    return <div>Loading milk reception data...</div>;
  }

  if (error) {
    return <div>Error loading milk reception data: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Reception Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Volume (L)</TableHead>
              <TableHead>Temperature (°C)</TableHead>
              <TableHead>Quality Score</TableHead>
              <TableHead>Fat %</TableHead>
              <TableHead>Protein %</TableHead>
              <TableHead>TPC</TableHead>
              <TableHead>Acidity</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milkReception?.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.supplier_name}</TableCell>
                <TableCell>{record.milk_volume.toFixed(2)}</TableCell>
                <TableCell>{record.temperature.toFixed(1)}</TableCell>
                <TableCell>{record.quality_score}</TableCell>
                <TableCell>{record.fat_percentage.toFixed(1)}</TableCell>
                <TableCell>{record.protein_percentage.toFixed(1)}</TableCell>
                <TableCell>{record.total_plate_count.toLocaleString()}</TableCell>
                <TableCell>{record.acidity.toFixed(1)}</TableCell>
                <TableCell>{format(new Date(record.datetime), 'PPp')}</TableCell>
                <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionTable;