
import React from 'react';
import { useMilkPreparationData } from './hooks/useMilkPreparationData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { RefreshCw } from "lucide-react";

const MilkPreparationRecords = () => {
  const { preparations, isLoading, fetchPreparations } = useMilkPreparationData();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleRefresh = () => {
    fetchPreparations();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Milk Preparation Records</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading records...</div>
        ) : preparations.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No milk preparation records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Milk Volume (L)</TableHead>
                  <TableHead>Pre-Stand. Fat (%)</TableHead>
                  <TableHead>Target Fat (%)</TableHead>
                  <TableHead>Homogenization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preparations.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.batch_id}</TableCell>
                    <TableCell>{formatDate(record.created_at)}</TableCell>
                    <TableCell>{record.milk_volume}</TableCell>
                    <TableCell>{record.pre_standardization_fat}%</TableCell>
                    <TableCell>{record.target_fat}%</TableCell>
                    <TableCell>
                      {record.homogenization_duration ? 
                        `${record.homogenization_duration} mins at ${record.homogenization_temperature || 'N/A'}°C` : 
                        'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilkPreparationRecords;
