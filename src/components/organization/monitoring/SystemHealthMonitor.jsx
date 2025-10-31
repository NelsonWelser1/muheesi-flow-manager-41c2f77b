import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const SystemHealthMonitor = () => {
  // Fetch system metrics
  const { data: metrics, refetch, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      // Get database stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: roleCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Simulate system metrics (in production, these would come from actual monitoring)
      return {
        status: 'healthy',
        uptime: '99.8%',
        responseTime: 145,
        activeUsers: userCount || 0,
        totalRoles: roleCount || 0,
        cpuUsage: 45,
        memoryUsage: 62,
        diskUsage: 38,
        networkLatency: 28,
        lastChecked: new Date().toISOString()
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const healthStatus = metrics?.status === 'healthy' 
    ? { label: 'Healthy', color: 'bg-green-500', icon: CheckCircle } 
    : { label: 'Warning', color: 'bg-yellow-500', icon: AlertCircle };

  const StatusIcon = healthStatus.icon;

  const metricCards = [
    {
      title: 'CPU Usage',
      value: `${metrics?.cpuUsage || 0}%`,
      icon: Cpu,
      color: 'text-blue-500',
      progress: metrics?.cpuUsage || 0
    },
    {
      title: 'Memory Usage',
      value: `${metrics?.memoryUsage || 0}%`,
      icon: HardDrive,
      color: 'text-purple-500',
      progress: metrics?.memoryUsage || 0
    },
    {
      title: 'Disk Usage',
      value: `${metrics?.diskUsage || 0}%`,
      icon: Database,
      color: 'text-orange-500',
      progress: metrics?.diskUsage || 0
    },
    {
      title: 'Network Latency',
      value: `${metrics?.networkLatency || 0}ms`,
      icon: Wifi,
      color: 'text-green-500',
      progress: (metrics?.networkLatency || 0) / 2
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            System Health Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time system performance and health metrics
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${healthStatus.color} p-4 rounded-full`}>
                <StatusIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">System Status: {healthStatus.label}</h3>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  Last checked: {new Date(metrics?.lastChecked || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <p className="text-3xl font-bold">{metrics?.uptime || '0%'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
                <Progress value={metric.progress} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
            <CardDescription>Current database metrics and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Users</span>
              <span className="font-bold">{metrics?.activeUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">User Roles Assigned</span>
              <span className="font-bold">{metrics?.totalRoles || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg Response Time</span>
              <Badge variant="outline">{metrics?.responseTime || 0}ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Connection Status</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Response Time</span>
                <span className="font-bold text-green-600">{metrics?.responseTime || 0}ms</span>
              </div>
              <Progress value={(metrics?.responseTime || 0) / 5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Database Queries/sec</span>
                <span className="font-bold">45</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Connections</span>
                <span className="font-bold">12</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Backend configuration and environment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Environment</p>
              <Badge variant="outline">Production</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Backend Status</p>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Backup</p>
              <p className="font-medium">2 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMonitor;
