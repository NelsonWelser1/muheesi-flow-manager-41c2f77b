
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Syringe, HeartPulse, Pill, Loader2 } from "lucide-react";
import { useHealthRecords } from '@/hooks/useHealthRecords';

const HealthRecordsTable = ({ cattleId }) => {
  const { healthRecords, isLoading, error } = useHealthRecords(cattleId);

  const getStatusColor = (record) => {
    const now = new Date();
    const recordDate = new Date(record.record_date);
    const nextDueDate = record.next_due_date ? new Date(record.next_due_date) : null;
    
    if (nextDueDate && nextDueDate < now) {
      return 'bg-red-100 text-red-800';
    } else if (nextDueDate && nextDueDate > now) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4 text-purple-500" />;
      case 'treatment':
        return <Pill className="h-4 w-4 text-blue-500" />;
      case 'examination':
        return <HeartPulse className="h-4 w-4 text-green-500" />;
      case 'deworming':
        return <Pill className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="ml-2">Loading health records...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-red-500">
        <p>Error loading health records: {error.message}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cattle</TableHead>
              <TableHead>Tag Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="max-w-[500px]">Description</TableHead>
              <TableHead>Administered By</TableHead>
              <TableHead>Next Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthRecords && healthRecords.length > 0 ? (
              healthRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {formatDate(record.record_date)}
                  </TableCell>
                  <TableCell>
                    {record.cattle_inventory?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.cattle_inventory?.tag_number || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.record_type)}
                      {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[500px]">{record.description}</TableCell>
                  <TableCell>{record.administered_by || '-'}</TableCell>
                  <TableCell>
                    {record.next_due_date ? (
                      <Badge className={getStatusColor(record)}>
                        {formatDate(record.next_due_date)}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No health records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default HealthRecordsTable;
