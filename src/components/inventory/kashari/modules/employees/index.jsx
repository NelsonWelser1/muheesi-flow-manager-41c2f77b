
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import EmployeeList from './EmployeeList';
import AttendanceManager from './AttendanceManager';
import PayrollManager from './PayrollManager';
import AddEmployeeForm from './AddEmployeeForm';

const EmployeeManagement = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
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

            {/* Employee List Tab */}
            <TabsContent value="employees" className="space-y-4 mt-4">
              <EmployeeList />
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-4 mt-4">
              <AttendanceManager />
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="space-y-4 mt-4">
              <PayrollManager />
            </TabsContent>

            {/* Add Employee Tab */}
            <TabsContent value="add" className="space-y-4 mt-4">
              <AddEmployeeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
