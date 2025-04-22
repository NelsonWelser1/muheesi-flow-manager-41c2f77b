
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, Users, FileText, Settings, Calendar, CheckSquare, Phone, CreditCard, Package, DollarSign, Box, Handshake, FolderArchive, BarChart, BellRing } from 'lucide-react';
import PADashboard from './pa-dashboard/PADashboard';

const RoleDashboard = ({ role }) => {
  // Return the specialized PA Dashboard if the role is CEO's Personal Assistant
  if (role === "CEO's Personal Assistant") {
    return <PADashboard />;
  }

  // Dynamic content based on role for other roles
  const getRoleSpecificContent = () => {
    switch (role) {
      case 'Chief Executive Officer (CEO)':
        return {
          title: 'CEO Dashboard',
          metrics: [
            { title: 'Total Revenue', value: 'UGX 1,245,000,000', change: '+12.5%', icon: <BarChart3 className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Active Projects', value: '8', change: '+2', icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Company Value', value: 'UGX 3.2B', change: '+5.7%', icon: <LineChart className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Total Employees', value: '126', change: '+3', icon: <Users className="h-5 w-5 text-muted-foreground" /> },
          ]
        };
      case 'System Administrator (SysAdmin)':
        return {
          title: 'System Admin Dashboard',
          metrics: [
            { title: 'System Uptime', value: '99.9%', change: '+0.2%', icon: <Settings className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Active Users', value: '87', change: '+5', icon: <Users className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Pending Tickets', value: '12', change: '-3', icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
            { title: 'System Health', value: 'Good', change: 'Stable', icon: <LineChart className="h-5 w-5 text-muted-foreground" /> },
          ]
        };
      default:
        return {
          title: `${role} Dashboard`,
          metrics: [
            { title: 'Key Performance', value: '94%', change: '+2.5%', icon: <BarChart3 className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Tasks Completed', value: '24', change: '+7', icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Department Budget', value: 'UGX 45M', change: '-2.3%', icon: <PieChart className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Upcoming Events', value: '3', change: '+1', icon: <Calendar className="h-5 w-5 text-muted-foreground" /> },
          ]
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-3xl font-bold tracking-tight">{roleContent.title}</h2>
        <div className="mt-2 sm:mt-0">
          <span className="text-sm text-muted-foreground">Last updated: Today, 4:30 PM</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleContent.metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest activities and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-2 border-b pb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Activity {item} - Today at {Math.floor(Math.random() * 12)}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Priorities</CardTitle>
                <CardDescription>Your important tasks and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm">Priority Task {item}</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Due in {Math.floor(Math.random() * 5) + 1} days
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-gray-500">Analytics visualization will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Documents</CardTitle>
              <CardDescription>Access and manage your reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((report) => (
                  <div key={report} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Monthly Report {report}</p>
                        <p className="text-sm text-gray-500">Added on April {report + 10}, 2025</p>
                      </div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleDashboard;
