
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const EmployeeRecordsTable = ({ records, isLoading, error }) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading employee records...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading records: {error.message}</div>;
  }

  if (!records || records.length === 0) {
    return <div className="text-center p-4">No employee records found. Try adjusting your filters.</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800',
      'Suspended': 'bg-orange-100 text-orange-800',
      'Training': 'bg-blue-100 text-blue-800',
      'Probation': 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status || 'Unknown'}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Shift Start</TableHead>
            <TableHead>Shift End</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Review Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.employee_id}</TableCell>
              <TableCell>{record.job_title}</TableCell>
              <TableCell>{record.department || '-'}</TableCell>
              <TableCell>{formatDate(record.shift_start)}</TableCell>
              <TableCell>{formatDate(record.shift_end)}</TableCell>
              <TableCell>{record.performance_rating}/5</TableCell>
              <TableCell>{formatDate(record.review_date_time)}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeRecordsTable;
