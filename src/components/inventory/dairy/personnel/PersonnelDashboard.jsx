import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserPlus, UserCheck, Star, CalendarClock, Clock, TimerIcon, ClipboardList, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EmployeeRecordsForm from './forms/EmployeeRecordsForm';
import TrainingEvaluationForm from './forms/TrainingEvaluationForm';
import RecruitmentManagementForm from './forms/RecruitmentManagementForm';

const PersonnelDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  // Fetch metrics using React Query
  const { data: employeeCount = 0 } = useQuery({
    queryKey: ['employeeCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: avgPerformance = 0 } = useQuery({
    queryKey: ['avgPerformance'],
    queryFn: async () => {
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('performance_rating');
      if (!data?.length) return 0;
      const avg = data.reduce((acc, curr) => acc + curr.performance_rating, 0) / data.length;
      return Number(avg.toFixed(1));
    }
  });

  const { data: activeRecruitments = 0 } = useQuery({
    queryKey: ['activeRecruitments'],
    queryFn: async () => {
      const { count } = await supabase
        .from('personnel_recruitment_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      return count || 0;
    }
  });

  const { data: onShiftCount = 0 } = useQuery({
    queryKey: ['onShiftCount'],
    queryFn: async () => {
      const now = new Date();
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true })
        .lte('shift_start', now.toISOString())
        .gte('shift_end', now.toISOString());
      return count || 0;
    }
  });

  const { data: hoursWorked = 0 } = useQuery({
    queryKey: ['hoursWorked'],
    queryFn: async () => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('shift_start, shift_end')
        .gte('shift_start', startOfWeek.toISOString());
      
      if (!data?.length) return 0;
      const hours = data.reduce((acc, curr) => {
        const start = new Date(curr.shift_start);
        const end = new Date(curr.shift_end);
        return acc + (end - start) / (1000 * 60 * 60);
      }, 0);
      return Math.round(hours);
    }
  });

  const { data: pendingReviews = 0 } = useQuery({
    queryKey: ['pendingReviews'],
    queryFn: async () => {
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
      const { count } = await supabase
        .from('personnel_employee_records')
        .select('*', { count: 'exact', head: true })
        .lte('review_date_time', endOfWeek.toISOString());
      return count || 0;
    }
  });

  const { data: currentShift = [] } = useQuery({
    queryKey: ['currentShift'],
    queryFn: async () => {
      const now = new Date();
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('employee_id, job_title, shift_start, shift_end')
        .lte('shift_start', now.toISOString())
        .gte('shift_end', now.toISOString())
        .order('shift_start', { ascending: true });
      return data || [];
    }
  });

  const handleBack = () => {
    setActiveComponent(null);
  };

  if (activeComponent) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back to Personnel Dashboard
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{activeComponent}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeComponent === "Employee Records & Scheduling" && <EmployeeRecordsForm />}
            {activeComponent === "Training & Performance" && <TrainingEvaluationForm />}
            {activeComponent === "Recruitment Management" && <RecruitmentManagementForm />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Personnel Management</h2>
      
      {/* Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100"
          onClick={() => setActiveComponent("Employee Records & Scheduling")}
        >
          <Users className="h-8 w-8" />
          <span className="text-lg font-semibold">Employee Records & Scheduling</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100"
          onClick={() => setActiveComponent("Training & Performance")}
        >
          <GraduationCap className="h-8 w-8" />
          <span className="text-lg font-semibold">Training & Performance</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100"
          onClick={() => setActiveComponent("Recruitment Management")}
        >
          <UserPlus className="h-8 w-8" />
          <span className="text-lg font-semibold">Recruitment Management</span>
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">Active personnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPerformance}/5</div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recruitments</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRecruitments}</div>
            <p className="text-xs text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Shift</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onShiftCount}</div>
            <p className="text-xs text-muted-foreground">Morning shift active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoursWorked}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Shift Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Current Shift Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Shift</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentShift.map((employee, index) => {
                  const shiftStart = new Date(employee.shift_start);
                  const shiftEnd = new Date(employee.shift_end);
                  const now = new Date();
                  const status = now >= shiftStart && now <= shiftEnd ? "Active" : "Scheduled";
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{employee.employee_id}</td>
                      <td className="p-2">{employee.job_title}</td>
                      <td className="p-2">
                        {shiftStart.toLocaleTimeString()} - {shiftEnd.toLocaleTimeString()}
                      </td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!currentShift.length && (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No active shifts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jan', performance: 4.2 },
                { month: 'Feb', performance: 4.5 },
                { month: 'Mar', performance: 4.3 },
                { month: 'Apr', performance: 4.6 },
                { month: 'May', performance: 4.8 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelDashboard;
