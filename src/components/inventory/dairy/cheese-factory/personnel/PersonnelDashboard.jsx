
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, UserPlus, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeRecordsForm from './forms/EmployeeRecordsForm';
import TrainingEvaluationForm from './forms/TrainingEvaluationForm';
import RecruitmentManagementForm from './forms/RecruitmentManagementForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

const PersonnelDashboard = () => {
  const { data: employeeStats = {} } = useQuery({
    queryKey: ['employeeStats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('personnel_employee_records')
        .select('*');
      
      return {
        total: data?.length || 0,
        active: data?.filter(e => e.status === 'Active').length || 0,
        onLeave: data?.filter(e => e.status === 'On Leave').length || 0,
        trainingRequired: data?.filter(e => e.training_status === 'Required').length || 0
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats.total}</div>
            <p className="text-xs text-muted-foreground">Currently employed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats.active}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Scheduled absence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Training Required</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats.trainingRequired}</div>
            <p className="text-xs text-muted-foreground">Pending training</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList>
              <TabsTrigger value="records">Employee Records</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            </TabsList>

            <TabsContent value="records">
              <EmployeeRecordsForm />
            </TabsContent>

            <TabsContent value="training">
              <TrainingEvaluationForm />
            </TabsContent>

            <TabsContent value="recruitment">
              <RecruitmentManagementForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonnelDashboard;
