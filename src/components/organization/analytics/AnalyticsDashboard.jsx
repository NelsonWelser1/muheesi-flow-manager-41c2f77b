import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  Building2,
  Activity
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: withRoles } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        usersWithRoles: withRoles || 0,
        activeCompanies: 3,
        dailyLogins: 45,
        weeklyActivity: [
          { day: 'Mon', users: 12, logins: 28 },
          { day: 'Tue', users: 15, logins: 35 },
          { day: 'Wed', users: 18, logins: 42 },
          { day: 'Thu', users: 14, logins: 31 },
          { day: 'Fri', users: 16, logins: 38 },
          { day: 'Sat', users: 8, logins: 15 },
          { day: 'Sun', users: 6, logins: 12 }
        ],
        companyActivity: [
          { company: 'Grand Berna Dairies', users: 89, transactions: 245 },
          { company: 'KAJON Coffee Limited', users: 67, transactions: 189 },
          { company: 'Kyalima Farmers Limited', users: 45, transactions: 134 }
        ]
      };
    }
  });

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      ...analytics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            System-wide analytics, performance metrics, and usage statistics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last period
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users with Roles</p>
                <p className="text-2xl font-bold">{analytics?.usersWithRoles || 0}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last period
                </p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold">{analytics?.activeCompanies || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All operational
                </p>
              </div>
              <Building2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Logins</p>
                <p className="text-2xl font-bold">{analytics?.dailyLogins || 0}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% from yesterday
                </p>
              </div>
              <Activity className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly User Activity</CardTitle>
          <CardDescription>Active users and login activity for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.weeklyActivity.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium w-12">{day.day}</span>
                  <span className="text-muted-foreground">{day.users} users</span>
                  <span className="text-muted-foreground">{day.logins} logins</span>
                </div>
                <div className="flex gap-2">
                  <div 
                    className="h-6 bg-primary rounded"
                    style={{ width: `${(day.users / 20) * 100}%` }}
                  />
                  <div 
                    className="h-6 bg-accent rounded"
                    style={{ width: `${(day.logins / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded" />
              <span className="text-sm text-muted-foreground">Login Events</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Company Activity Breakdown</CardTitle>
          <CardDescription>Usage statistics by company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.companyActivity.map((company, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{company.company}</span>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Users: </span>
                      <span className="font-bold">{company.users}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transactions: </span>
                      <span className="font-bold">{company.transactions}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Activity Level</span>
                    <span>{Math.round((company.transactions / 250) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full"
                      style={{ width: `${(company.transactions / 250) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
          <CardDescription>Key insights from the selected time period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Peak Activity Day</p>
              <p className="text-xl font-bold">Wednesday</p>
              <p className="text-sm text-muted-foreground">42 logins recorded</p>
            </div>
            <div className="p-4 bg-success/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Most Active Company</p>
              <p className="text-xl font-bold">Grand Berna Dairies</p>
              <p className="text-sm text-muted-foreground">245 transactions</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Session Duration</p>
              <p className="text-xl font-bold">28 minutes</p>
              <p className="text-sm text-muted-foreground">+5 min from last period</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">User Engagement Rate</p>
              <p className="text-xl font-bold">84%</p>
              <p className="text-sm text-muted-foreground">Above target of 75%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
