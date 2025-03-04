
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

const AttendanceManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clockInfo, setClockInfo] = useState({
    employeeId: '',
    isClockingIn: true
  });

  // Fetch employees data
  const { data: employees = [] } = useQuery({
    queryKey: ['personnel_employee_records'],
    queryFn: async () => {
      const { data, error } = await supabase.from('personnel_employee_records').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch attendance records
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['personnel_attendance'],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const { data, error } = await supabase
        .from('personnel_attendance')
        .select('*')
        .gte('timestamp', startOfDay)
        .lte('timestamp', endOfDay);
      if (error) throw error;
      return data || [];
    }
  });

  // Clock in/out mutation
  const clockInOutMutation = useMutation({
    mutationFn: async ({ employeeId, type }) => {
      const { data, error } = await supabase
        .from('personnel_attendance')
        .insert([{
          employee_id: employeeId,
          type,
          timestamp: new Date().toISOString()
        }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_attendance'] });
      toast({
        title: "Success",
        description: `${clockInfo.isClockingIn ? 'Clock-in' : 'Clock-out'} recorded successfully`
      });
      setClockInfo({
        employeeId: '',
        isClockingIn: true
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record attendance: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle clock in/out
  const handleClockInOut = () => {
    if (!clockInfo.employeeId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }
    clockInOutMutation.mutate({
      employeeId: clockInfo.employeeId,
      type: clockInfo.isClockingIn ? 'clock_in' : 'clock_out'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clock In/Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select 
                value={clockInfo.employeeId} 
                onValueChange={value => setClockInfo({
                  ...clockInfo,
                  employeeId: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.employee_id}>
                      {employee.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex space-x-2">
                <Button 
                  variant={clockInfo.isClockingIn ? "default" : "outline"} 
                  onClick={() => setClockInfo({
                    ...clockInfo,
                    isClockingIn: true
                  })} 
                  className="flex-1"
                >
                  Clock In
                </Button>
                <Button 
                  variant={!clockInfo.isClockingIn ? "default" : "outline"} 
                  onClick={() => setClockInfo({
                    ...clockInfo,
                    isClockingIn: false
                  })} 
                  className="flex-1"
                >
                  Clock Out
                </Button>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleClockInOut} 
                disabled={!clockInfo.employeeId}
              >
                <Clock className="mr-2 h-4 w-4" />
                {clockInfo.isClockingIn ? "Record Clock In" : "Record Clock Out"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
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
      </div>

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
    </div>
  );
};

export default AttendanceManagement;
