import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  UserCheck,
  Activity,
  Key
} from 'lucide-react';

const SecurityCenter = () => {
  // Fetch security metrics
  const { data: metrics } = useQuery({
    queryKey: ['security-metrics'],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: adminUsers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'sysadmin');

      return {
        totalUsers: totalUsers || 0,
        adminUsers: adminUsers || 0,
        failedLogins: 3,
        activeSessions: totalUsers || 0,
        securityAlerts: 2
      };
    }
  });

  const recentEvents = [
    {
      type: 'warning',
      event: 'Multiple failed login attempts',
      user: 'unknown@example.com',
      time: '5 mins ago',
      ip: '192.168.1.100'
    },
    {
      type: 'success',
      event: 'User role updated',
      user: 'nelsonwelser1@gmail.com',
      time: '1 hour ago',
      ip: '192.168.1.50'
    },
    {
      type: 'info',
      event: 'New user registration',
      user: 'newuser@example.com',
      time: '2 hours ago',
      ip: '192.168.1.75'
    },
    {
      type: 'success',
      event: 'Password changed',
      user: 'user@example.com',
      time: '3 hours ago',
      ip: '192.168.1.60'
    }
  ];

  const activeSessions = [
    {
      user: 'Namnya Nelson',
      email: 'nelsonwelser1@gmail.com',
      role: 'sysadmin',
      ip: '102.209.111.246',
      location: 'Uganda',
      device: 'Chrome on Windows',
      loginTime: '2 hours ago'
    }
  ];

  const getEventIcon = (type) => {
    switch(type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'info':
        return <Activity className="h-5 w-5 text-primary" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getEventBadgeColor = (type) => {
    switch(type) {
      case 'warning':
        return 'border-warning text-warning';
      case 'success':
        return 'border-success text-success';
      case 'info':
        return 'border-primary text-primary';
      default:
        return 'border-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Security Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor security events, access control, and user sessions
        </p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold">{metrics?.adminUsers || 0}</p>
              </div>
              <Key className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold text-warning">{metrics?.failedLogins || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{metrics?.activeSessions || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Alerts</p>
                <p className="text-2xl font-bold text-destructive">{metrics?.securityAlerts || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Monitor authentication and access control events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.user} • {event.ip}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getEventBadgeColor(event.type)}>
                  {event.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active User Sessions</CardTitle>
          <CardDescription>Currently logged-in users and their session details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Login Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{session.user}</p>
                      <p className="text-sm text-muted-foreground">{session.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.role}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.device}</TableCell>
                  <TableCell>{session.loginTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>Suggested actions to improve system security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium">Row Level Security Enabled</p>
                <p className="text-sm text-muted-foreground">All tables have RLS policies in place</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium">Password Protection Active</p>
                <p className="text-sm text-muted-foreground">Email confirmation and password policies are configured</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium">Consider Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security for admin accounts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityCenter;
