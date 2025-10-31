import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Users,
  Shield,
  Building2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const BulkUserOperations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkRole, setBulkRole] = useState('');
  const [bulkCompany, setBulkCompany] = useState('');

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey (
            id,
            role,
            company
          )
        `);

      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        user_roles: user.user_roles?.[0] || null
      }));
    }
  });

  // Fetch companies
  const { data: companies } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company')
        .not('company', 'is', null);

      if (error) throw error;
      
      return [...new Set(data.map(r => r.company))];
    }
  });

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(u => u.id) || []);
    }
  };

  // Bulk assign role mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async ({ userIds, role, company }) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const operations = userIds.map(async (userId) => {
        const existingRole = users.find(u => u.id === userId)?.user_roles;
        
        if (existingRole?.id) {
          return supabase
            .from('user_roles')
            .update({
              role,
              company,
              assigned_by: currentUser.id
            })
            .eq('id', existingRole.id);
        } else {
          return supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role,
              company,
              assigned_by: currentUser.id
            });
        }
      });

      await Promise.all(operations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      toast.success(`Successfully updated ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setBulkAction('');
      setBulkRole('');
      setBulkCompany('');
    },
    onError: (error) => {
      toast.error(`Failed to update users: ${error.message}`);
    }
  });

  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (bulkAction === 'assign_role') {
      if (!bulkRole) {
        toast.error('Please select a role');
        return;
      }
      bulkAssignMutation.mutate({
        userIds: selectedUsers,
        role: bulkRole,
        company: bulkCompany || null
      });
    }
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Bulk User Operations
          </h1>
          <p className="text-muted-foreground mt-1">
            Perform actions on multiple users at once
          </p>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Select users and choose an action to apply
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Badge variant="outline" className="text-base">
              {selectedUsers.length} users selected
            </Badge>
            {selectedUsers.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign_role">Assign Role</SelectItem>
              </SelectContent>
            </Select>

            {bulkAction === 'assign_role' && (
              <>
                <Select value={bulkRole} onValueChange={setBulkRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sysadmin">System Administrator</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={bulkCompany} onValueChange={setBulkCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Company</SelectItem>
                    {companies?.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedUsers.length === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Select users for bulk operations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users?.length && users?.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
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
                      {user.user_roles ? (
                        <Badge variant="outline" className={getRoleBadgeColor(user.user_roles.role)}>
                          {user.user_roles.role}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No role</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.user_roles?.company ? (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.user_roles.company}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
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

export default BulkUserOperations;
