
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, Clock, DollarSign, UserPlus, Search, Filter, 
  UserCheck, UserX, Calendar, MoreHorizontal, Sliders
} from "lucide-react";

const EmployeeManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clockInfo, setClockInfo] = useState({
    employeeId: '',
    isClockingIn: true
  });

  const form = useForm({
    defaultValues: {
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      salary: '',
      status: 'Active'
    }
  });

  // Fetch employees data
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['personnel_employee_records'],
    queryFn: async () => {
      let query = supabase.from('personnel_employee_records').select('*');
      
      if (searchTerm) {
        query = query.or(`employee_id.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%`);
      }
      
      if (departmentFilter) {
        query = query.eq('department', departmentFilter);
      }
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
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

  // Fetch payroll data
  const { data: payrollData = [], isLoading: isLoadingPayroll } = useQuery({
    queryKey: ['personnel_payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_payroll')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: async (newEmployee) => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .insert([newEmployee]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_employee_records'] });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add employee: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update employee status mutation
  const updateEmployeeStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_employee_records'] });
      toast({
        title: "Success",
        description: "Employee status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update employee status: ${error.message}`,
        variant: "destructive",
      });
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
        description: `${clockInfo.isClockingIn ? 'Clock-in' : 'Clock-out'} recorded successfully`,
      });
      setClockInfo({ employeeId: '', isClockingIn: true });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record attendance: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data) => {
    addEmployeeMutation.mutate(data);
  };

  // Handle status update
  const handleStatusUpdate = (id, status) => {
    updateEmployeeStatusMutation.mutate({ id, status });
  };

  // Handle clock in/out
  const handleClockInOut = () => {
    if (!clockInfo.employeeId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive",
      });
      return;
    }
    
    clockInOutMutation.mutate({
      employeeId: clockInfo.employeeId,
      type: clockInfo.isClockingIn ? 'clock_in' : 'clock_out'
    });
  };

  // Calculate department statistics
  const departmentStats = React.useMemo(() => {
    const stats = {};
    employees.forEach(employee => {
      if (employee.department) {
        stats[employee.department] = (stats[employee.department] || 0) + 1;
      }
    });
    return stats;
  }, [employees]);

  // Calculate status statistics
  const statusStats = React.useMemo(() => {
    const stats = {
      Active: 0,
      Inactive: 0,
      'On Leave': 0
    };
    
    employees.forEach(employee => {
      if (employee.status) {
        stats[employee.status] = (stats[employee.status] || 0) + 1;
      }
    });
    
    return stats;
  }, [employees]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Personnel Management Dashboard
          </CardTitle>
          <CardDescription>
            Manage employee records, attendance, and payroll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employees">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="employees">Employee List</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="add">Add Employee</TabsTrigger>
            </TabsList>

            {/* Employee List Tab */}
            <TabsContent value="employees" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-1/2">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Total Employees</p>
                        <p className="text-2xl font-bold">{employees.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Active Employees</p>
                        <p className="text-2xl font-bold">{statusStats.Active}</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">On Leave</p>
                        <p className="text-2xl font-bold">{statusStats['On Leave']}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name/ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingEmployees ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Loading employees...</TableCell>
                      </TableRow>
                    ) : employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No employees found</TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.employee_id}
                          </TableCell>
                          <TableCell>{employee.job_title}</TableCell>
                          <TableCell>{employee.department || '-'}</TableCell>
                          <TableCell>
                            {employee.email || 'No email'}<br />
                            {employee.phone || 'No phone'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status === 'Active' ? 'default' :
                                employee.status === 'Inactive' ? 'destructive' : 'outline'
                              }
                            >
                              {employee.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              defaultValue={employee.status || 'Active'}
                              onValueChange={(value) => handleStatusUpdate(employee.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="On Leave">On Leave</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clock In/Out</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Select
                        value={clockInfo.employeeId}
                        onValueChange={(value) => setClockInfo({ ...clockInfo, employeeId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.employee_id}>
                              {employee.employee_id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant={clockInfo.isClockingIn ? "default" : "outline"}
                          onClick={() => setClockInfo({ ...clockInfo, isClockingIn: true })}
                          className="flex-1"
                        >
                          Clock In
                        </Button>
                        <Button
                          variant={!clockInfo.isClockingIn ? "default" : "outline"}
                          onClick={() => setClockInfo({ ...clockInfo, isClockingIn: false })}
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
                          attendanceRecords.map((record) => (
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
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payroll Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Bonus</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Net Pay</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingPayroll ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">Loading payroll data...</TableCell>
                          </TableRow>
                        ) : payrollData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">No payroll data found</TableCell>
                          </TableRow>
                        ) : (
                          payrollData.map((payroll) => (
                            <TableRow key={payroll.id}>
                              <TableCell>{payroll.employee_id}</TableCell>
                              <TableCell>
                                {format(new Date(payroll.payment_date), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell>${payroll.base_salary?.toFixed(2) || '0.00'}</TableCell>
                              <TableCell>${payroll.bonus?.toFixed(2) || '0.00'}</TableCell>
                              <TableCell>${payroll.deductions?.toFixed(2) || '0.00'}</TableCell>
                              <TableCell className="font-medium">
                                ${((payroll.base_salary || 0) + (payroll.bonus || 0) - (payroll.deductions || 0)).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add Employee Tab */}
            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add New Employee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="employee_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employee ID</FormLabel>
                              <FormControl>
                                <Input placeholder="EMP-0001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="job_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Farm Manager" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Administration">Administration</SelectItem>
                                  <SelectItem value="Production">Production</SelectItem>
                                  <SelectItem value="Sales">Sales</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="HR">HR</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">Inactive</SelectItem>
                                  <SelectItem value="On Leave">On Leave</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="employee@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="base_salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Salary</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
