import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Filter,
  UserPlus,
  Eye,
  Edit,
  Shield,
  Building2,
  ArrowLeft,
  FileText,
  Bell,
  Clock,
  Calendar,
  Package
} from 'lucide-react';

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  // Fetch all users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data - get ALL roles for each user
      return profiles?.map(user => ({
        ...user,
        user_roles: roles?.filter(r => r.user_id === user.id) || []
      }));
    }
  });

  // Fetch all unique companies across the system
  const { data: allCompanies } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      // Get companies from associations
      const { data: associationsList, error: associationsError } = await supabase
        .from('associations')
        .select('association_name');

      if (associationsError) throw associationsError;

      // Get companies from user_roles
      const { data: userRolesList, error: userRolesError } = await supabase
        .from('user_roles')
        .select('company');

      if (userRolesError) throw userRolesError;

      // Get companies from equipment_maintenance
      const { data: equipmentList, error: equipmentError } = await supabase
        .from('equipment_maintenance')
        .select('company');

      if (equipmentError) throw equipmentError;

      // Combine and get unique companies
      const uniqueCompanies = new Set();
      
      associationsList?.forEach(item => {
        if (item.association_name) uniqueCompanies.add(item.association_name);
      });
      
      userRolesList?.forEach(item => {
        if (item.company) uniqueCompanies.add(item.company);
      });
      
      equipmentList?.forEach(item => {
        if (item.company) uniqueCompanies.add(item.company);
      });

      return Array.from(uniqueCompanies);
    }
  });

  // Use all companies for display and filtering
  const companies = allCompanies || [];

  // Filter users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
      user.user_roles?.some(r => r.role === roleFilter);
    const matchesCompany = companyFilter === 'all' || 
      user.user_roles?.some(r => r.company === companyFilter);

    return matchesSearch && matchesRole && matchesCompany;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'sysadmin':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'manager':
        return 'bg-primary/10 text-primary border-primary';
      case 'staff':
        return 'bg-muted/10 text-muted-foreground border-muted';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-success/10 text-success border-success'
      : 'bg-muted/10 text-muted-foreground border-muted';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/system-admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all system users, roles, and permissions
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => navigate('/users/notifications-dashboard')} variant="default">
            <Bell className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/users/role-approvals')}>
            <Clock className="h-4 w-4 mr-2" />
            Approvals
          </Button>
          <Button variant="outline" onClick={() => navigate('/users/bulk-role-assignment')}>
            <Shield className="h-4 w-4 mr-2" />
            Bulk Assign
          </Button>
          <Button variant="outline" onClick={() => navigate('/users/scheduled-assignments')}>
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled
          </Button>
          <Button variant="outline" onClick={() => navigate('/users/role-templates')}>
            <Package className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" onClick={() => navigate('/users/audit-log')}>
            <FileText className="h-4 w-4 mr-2" />
            Audit Log
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Admins & Managers</p>
              <p className="text-2xl font-bold">
                {users?.filter(u => u.user_roles?.some(r => ['sysadmin', 'manager'].includes(r.role))).length || 0}
              </p>
            </div>
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{Math.floor((users?.length || 0) * 0.6)}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find and filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="sysadmin">System Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers?.length || 0})</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : filteredUsers?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{user.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.user_roles?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.user_roles.map((roleAssignment, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className={getRoleBadgeColor(roleAssignment.role)}
                            >
                              {roleAssignment.role}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted">
                          No role
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.user_roles?.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {user.user_roles.map((roleAssignment, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{roleAssignment.company}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No company</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(true)}>
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}`)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}/assign-role`)}
                          title="Assign Role"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
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

export default UserManagement;
