
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import EmployeeList from './EmployeeList';
import AttendanceManagement from './AttendanceManagement';
import PayrollManagement from './PayrollManagement';
import AddEmployeeForm from './AddEmployeeForm';

const EmployeeManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-normal">
            <Users className="mr-2 h-6 w-6" />
            Employee Management Dashboard
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

            <TabsContent value="employees">
              <EmployeeList />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceManagement />
            </TabsContent>

            <TabsContent value="payroll">
              <PayrollManagement />
            </TabsContent>

            <TabsContent value="add">
              <AddEmployeeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
