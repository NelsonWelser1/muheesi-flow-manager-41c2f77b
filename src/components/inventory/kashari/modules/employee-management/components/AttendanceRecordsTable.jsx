
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AttendanceRecordsTable = ({ attendanceRecords, isLoadingAttendance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAttendance ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading attendance records...</TableCell>
                </TableRow>
              ) : attendanceRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No attendance records found for today</TableCell>
                </TableRow>
              ) : (
                attendanceRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employee_id}</TableCell>
                    <TableCell>
                      <Badge variant={record.type === 'clock_in' ? 'default' : 'secondary'}>
                        {record.type === 'clock_in' ? 'Clock In' : 'Clock Out'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.timestamp), 'MMM dd, yyyy hh:mm a')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceRecordsTable;
