
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import HRMetricsCards from './HRMetricsCards';
import EmployeeManagement from './EmployeeManagement';
import RecruitmentModule from './RecruitmentModule';
import TrainingModule from './TrainingModule';
import PayrollModule from './PayrollModule';
import PerformanceModule from './PerformanceModule';
import HRReports from './HRReports';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Human Resource Management</h2>
          <p className="text-muted-foreground">Comprehensive HR management system for all three companies</p>
        </div>
        <Badge variant="outline" className="text-success border-success">
          HR Manager Dashboard
        </Badge>
      </div>

      <HRMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="recruitment" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Recruitment
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>New hire: John Doe - Factory Worker</span>
                  <Badge variant="secondary">Today</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Training completed: Safety Protocol</span>
                  <Badge variant="secondary">Yesterday</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Performance review: Jane Smith</span>
                  <Badge variant="secondary">2 days ago</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>5 pending interviews</span>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>3 performance reviews due</span>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>2 training certifications expiring</span>
                  <Button size="sm" variant="outline">Renew</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Completed This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>8 new employee onboardings</span>
                  <Badge variant="secondary" className="text-success">Done</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>12 training sessions conducted</span>
                  <Badge variant="secondary" className="text-success">Done</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Payroll processed for 156 employees</span>
                  <Badge variant="secondary" className="text-success">Done</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>

        <TabsContent value="recruitment">
          <RecruitmentModule />
        </TabsContent>

        <TabsContent value="training">
          <TrainingModule />
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollModule />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceModule />
        </TabsContent>

        <TabsContent value="reports">
          <HRReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRDashboard;
