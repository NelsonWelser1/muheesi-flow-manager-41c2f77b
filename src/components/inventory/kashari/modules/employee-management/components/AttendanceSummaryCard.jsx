
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const AttendanceSummaryCard = ({ attendanceRecords }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Clocked In</p>
              <p className="text-2xl font-bold">
                {attendanceRecords.filter(r => r.type === 'clock_in').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clocked Out</p>
              <p className="text-2xl font-bold">
                {attendanceRecords.filter(r => r.type === 'clock_out').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceSummaryCard;
