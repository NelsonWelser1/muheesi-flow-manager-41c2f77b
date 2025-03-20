
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const TrainingRecordsTable = ({ records, isLoading, error }) => {
  if (error) {
    return <div className="p-4 text-red-500">Error loading records: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No training records found.
      </div>
    );
  }

  // Helper function to determine badge color based on rating
  const getRatingBadgeColor = (rating) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "destructive";
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Training Module</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.employee_id}</TableCell>
              <TableCell>{record.training_module}</TableCell>
              <TableCell>
                {record.training_date ? format(new Date(record.training_date), 'PPP') : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getRatingBadgeColor(record.performance_rating)}>
                  {record.performance_rating}/5
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{record.feedback || 'No feedback'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TrainingRecordsTable;
