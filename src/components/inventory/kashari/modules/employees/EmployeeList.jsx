
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCheck, Calendar, Users } from "lucide-react";

const EmployeeList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch employees data
  const {
    data: employees = [],
    isLoading: isLoadingEmployees
  } = useQuery({
    queryKey: ['personnel_employee_records', searchTerm, departmentFilter, statusFilter],
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
        description: "Employee status updated successfully"
      });
    },
    onError: error => {
      toast({
        title: "Error",
        description: `Failed to update employee status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle status update
  const handleStatusUpdate = (id, status) => {
    updateEmployeeStatusMutation.mutate({ id, status });
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 w-full md:w-1/2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
              <SelectItem value="Livestock farm">Livestock farm</SelectItem>
              <SelectItem value="Plantation">Plantation</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Finance & Accounts">Finance & Accounts</SelectItem>
              <SelectItem value="Scholarships">Scholarships</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              employees.map(employee => (
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
                    <Badge variant={employee.status === 'Active' ? 'default' : employee.status === 'Inactive' ? 'destructive' : 'outline'}>
                      {employee.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select defaultValue={employee.status || 'Active'} onValueChange={value => handleStatusUpdate(employee.id, value)}>
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
    </div>
  );
};

export default EmployeeList;
