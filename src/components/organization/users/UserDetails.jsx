import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Edit,
  Trash2,
  Activity,
  History
} from 'lucide-react';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user details
  const { data: user, isLoading } = useQuery({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey (
            id,
            role,
            company,
            assigned_at,
            assigned_by
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        user_roles: data.user_roles?.[0] || null
      };
    }
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'sysadmin':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'admin':
        return 'bg-warning/10 text-warning border-warning';
      case 'manager':
        return 'bg-primary/10 text-primary border-primary';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg font-medium">User not found</p>
          <Button onClick={() => navigate('/users')} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground mt-1">
            View and manage user information
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/users/${userId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* User Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-2xl">
                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                <Badge variant="outline" className="bg-success/10 text-success border-success">
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic user details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium">{user.full_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-sm">{user.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Current account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Login Count</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Assignment</CardTitle>
              <CardDescription>Current role and company assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.user_roles ? (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Shield className="h-8 w-8 text-primary" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Role:</span>
                          <Badge variant="outline" className={getRoleBadgeColor(user.user_roles.role)}>
                            {user.user_roles.role}
                          </Badge>
                        </div>
                        {user.user_roles.company && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{user.user_roles.company}</span>
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground mt-1">
                          Assigned: {new Date(user.user_roles.assigned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-lg font-medium">No role assigned</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assign a role to grant permissions
                  </p>
                  <Button>
                    <Shield className="h-4 w-4 mr-2" />
                    Assign Role
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User activity and action history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Logged in', time: '2 hours ago', icon: Activity },
                  { action: 'Updated profile', time: '1 day ago', icon: Edit },
                  { action: 'Changed password', time: '3 days ago', icon: Shield },
                  { action: 'Logged in', time: '5 days ago', icon: Activity },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
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

export default UserDetails;
