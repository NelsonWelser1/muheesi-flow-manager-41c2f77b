
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserPlus, UserCheck, Star, CalendarClock } from "lucide-react";
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
      </div>

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
