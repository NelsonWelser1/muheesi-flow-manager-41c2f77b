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
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/components/ui/confirmation-dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { TableLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState, EmptyState, PermissionDenied } from "@/components/ui/error-state";
import { bulkRoleAssignmentSchema } from "@/utils/roleValidation";
import { 
  ArrowLeft,
  Users,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const BulkUserOperations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { confirm, Dialog } = useConfirmation();
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkRole, setBulkRole] = useState('');
  const [bulkCompany, setBulkCompany] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch all users
  const { data: users, isLoading, error: usersError, refetch } = useQuery({
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

  const handleBulkAction = async () => {
    setValidationErrors({});

    // Validate input
    const validationData = {
      userIds: selectedUsers,
      role: bulkRole,
      company: bulkCompany || 'All Companies'
    };

    try {
      bulkRoleAssignmentSchema.parse(validationData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before continuing",
        variant: "destructive"
      });
      return;
    }

    // Role-company validation
    if (bulkRole === 'sysadmin' && bulkCompany !== 'All Companies') {
      setValidationErrors({ company: "System admins must be assigned to 'All Companies'" });
      toast({
        title: "Invalid Configuration",
        description: "System admins must be assigned to 'All Companies'",
        variant: "destructive"
      });
      return;
    }

    if (bulkRole !== 'sysadmin' && bulkCompany === 'All Companies') {
      setValidationErrors({ company: "Only system admins can be assigned to 'All Companies'" });
      toast({
        title: "Invalid Configuration",
        description: "Only system admins can be assigned to 'All Companies'",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = await confirm({
      title: "Confirm Bulk Role Assignment",
      description: `You are about to assign the role "${bulkRole}" ${bulkCompany ? `at "${bulkCompany}"` : ''} to ${selectedUsers.length} user(s). This action cannot be undone.`,
      confirmText: "Assign Roles",
      variant: "default"
    });

    if (!confirmed) return;

    bulkAssignMutation.mutate({
      userIds: selectedUsers,
      role: bulkRole,
      company: bulkCompany || null
    });
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

  // Permission check
  if (permissionsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <TableLoadingSkeleton rows={5} columns={5} />
      </div>
    );
  }

  if (!permissions?.canManageUsers) {
    return (
      <div className="container mx-auto p-6">
        <PermissionDenied 
          message="You don't have permission to perform bulk user operations"
          requiredRole="System Administrator or Manager"
        />
      </div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorState
          title="Failed to load users"
          message={usersError.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Dialog />
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

          <div className="space-y-4">
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
                  <div>
                    <Select value={bulkRole} onValueChange={setBulkRole}>
                      <SelectTrigger className={validationErrors.role ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sysadmin">System Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.role && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.role}
                      </p>
                    )}
                  </div>

                  <div>
                    <Select value={bulkCompany} onValueChange={setBulkCompany}>
                      <SelectTrigger className={validationErrors.company ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Companies">All Companies</SelectItem>
                        {companies?.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.company && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.company}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedUsers.length === 0 || bulkAssignMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {bulkAssignMutation.isPending ? 'Applying...' : 'Apply Action'}
              </Button>
            </div>

            {validationErrors.userIds && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {validationErrors.userIds}
              </p>
            )}
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
            <TableLoadingSkeleton rows={5} columns={5} />
          ) : !users || users.length === 0 ? (
            <EmptyState
              Icon={Users}
              title="No users found"
              message="There are no users in the system yet"
            />
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
