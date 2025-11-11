import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Calendar,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

const NotificationsDashboard = () => {
  const navigate = useNavigate();
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Fetch pending requests
  const { data: pendingRequests } = useQuery({
    queryKey: ['pending-requests-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_role_changes')
        .select(`
          *,
          requested_by_profile:profiles!pending_role_changes_requested_by_fkey(full_name),
          affected_user_profile:profiles!pending_role_changes_affected_user_fkey(full_name)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Fetch recent audit logs
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_change_audit_log')
        .select(`
          *,
          changed_by_profile:profiles!role_change_audit_log_changed_by_fkey(full_name),
          affected_user_profile:profiles!role_change_audit_log_affected_user_fkey(full_name)
        `)
        .order('changed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  // Fetch upcoming scheduled assignments
  const { data: upcomingAssignments } = useQuery({
    queryKey: ['upcoming-assignments-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_role_assignments')
        .select(`
          *,
          user_profile:profiles!scheduled_role_assignments_user_id_fkey(full_name)
        `)
        .eq('status', 'scheduled')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('pending-changes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_role_changes'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          setRealtimeUpdates(prev => [{
            id: Date.now(),
            type: payload.eventType,
            data: payload.new,
            timestamp: new Date()
          }, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActionIcon = (actionType) => {
    const icons = {
      assigned: CheckCircle,
      updated: AlertCircle,
      removed: AlertCircle
    };
    return icons[actionType] || Activity;
  };

  const getActionColor = (actionType) => {
    const colors = {
      assigned: 'text-green-600',
      updated: 'text-blue-600',
      removed: 'text-red-600'
    };
    return colors[actionType] || 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Role Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time updates and pending actions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Activity</p>
                <p className="text-2xl font-bold">
                  {recentActivity?.filter(a => 
                    new Date(a.changed_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Scheduled</p>
                <p className="text-2xl font-bold">{upcomingAssignments?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Real-time Updates</p>
                <p className="text-2xl font-bold">{realtimeUpdates.length}</p>
              </div>
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/users/role-approvals')}
              >
                View All
              </Button>
            </div>
            <CardDescription>Requests awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No pending requests
              </p>
            ) : (
              pendingRequests?.map((request) => (
                <div
                  key={request.id}
                  className="p-3 border rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => navigate('/users/role-approvals')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {request.affected_user_profile.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested by {request.requested_by_profile.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {request.requested_role}
                        </Badge>
                        <span className="text-xs">@</span>
                        <span className="text-xs">{request.requested_company}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(request.requested_at), 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/users/audit-log')}
              >
                Full Log
              </Button>
            </div>
            <CardDescription>Latest role changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity?.slice(0, 10).map((activity) => {
              const Icon = getActionIcon(activity.action_type);
              const colorClass = getActionColor(activity.action_type);
              
              return (
                <div key={activity.id} className="flex items-start gap-3 p-2 border-l-2 pl-3">
                  <Icon className={`h-4 w-4 mt-0.5 ${colorClass}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <strong>{activity.affected_user_profile.full_name}</strong>
                      {' '}{activity.action_type} as{' '}
                      <Badge variant="outline" className="text-xs">{activity.new_role}</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.changed_at), 'PPp')}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Scheduled Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Scheduled</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/users/scheduled-assignments')}
              >
                Manage
              </Button>
            </div>
            <CardDescription>Roles scheduled to take effect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No upcoming scheduled assignments
              </p>
            ) : (
              upcomingAssignments?.map((assignment) => (
                <div key={assignment.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {assignment.user_profile.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {assignment.role}
                        </Badge>
                        <span className="text-xs">@</span>
                        <span className="text-xs">{assignment.company}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Starts: {format(new Date(assignment.start_date), 'PPp')}
                      </p>
                      {assignment.end_date && (
                        <p className="text-xs text-muted-foreground">
                          Ends: {format(new Date(assignment.end_date), 'PPp')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Real-time Updates Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 animate-pulse text-green-600" />
              Live Updates
            </CardTitle>
            <CardDescription>Real-time activity feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {realtimeUpdates.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Waiting for updates...
              </p>
            ) : (
              realtimeUpdates.map((update) => (
                <div key={update.id} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-700">
                      {update.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-green-600">
                      {format(update.timestamp, 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    New request created
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsDashboard;
