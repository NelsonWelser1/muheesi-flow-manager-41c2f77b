import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, 
  ArrowLeft,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const CompanyDetails = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(companyName);

  // Fetch company users
  const { data: companyUsers, isLoading } = useQuery({
    queryKey: ['company-users', decodedName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey (
            role,
            company,
            assigned_at
          )
        `)
        .eq('user_roles.company', decodedName);

      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        user_roles: user.user_roles?.[0] || null
      })).filter(user => user.user_roles);
    }
  });

  const getCompanyType = (name) => {
    if (name.toLowerCase().includes('dairy') || name.toLowerCase().includes('dairies')) return 'Dairy';
    if (name.toLowerCase().includes('coffee')) return 'Coffee';
    if (name.toLowerCase().includes('farmer')) return 'Farmers';
    return 'Other';
  };

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/companies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            {decodedName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Company overview and user management
          </p>
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic details and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Company Type</span>
              <Badge variant="outline">{getCompanyType(decodedName)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Location</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Uganda</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="border-success text-success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Users</span>
              <span className="font-bold">{companyUsers?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Recent activity and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Today</span>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-success" />
                <span className="font-bold">{Math.floor((companyUsers?.length || 0) * 0.7)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">This Month</span>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold">+12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{companyUsers?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {companyUsers?.filter(u => u.user_roles?.role === 'admin' || u.user_roles?.role === 'sysadmin').length || 0}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{Math.floor((companyUsers?.length || 0) * 0.7)}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold text-success">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Users */}
      <Card>
        <CardHeader>
          <CardTitle>Company Users</CardTitle>
          <CardDescription>Users assigned to this company</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : companyUsers?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No users assigned</p>
              <p className="text-sm text-muted-foreground">Assign users to this company to see them here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(user.user_roles?.role)}>
                        {user.user_roles?.role || 'No role'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      {user.user_roles?.assigned_at 
                        ? new Date(user.user_roles.assigned_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetails;
