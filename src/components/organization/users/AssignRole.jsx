import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { validateRoleAssignment } from '@/utils/roleValidation';
import { usePermissions } from '@/hooks/usePermissions';
import { useConfirmation } from '@/components/ui/confirmation-dialog';
import { PermissionDenied } from '@/components/ui/error-state';
import { FormLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { 
  ArrowLeft,
  Shield,
  Building2,
  UserCog,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AssignRole = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const { confirm, Dialog } = useConfirmation();

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
            assigned_at
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

  // Fetch companies
  const { data: companies } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company')
        .not('company', 'is', null);

      if (error) throw error;
      
      const uniqueCompanies = [...new Set(data.map(r => r.company))];
      return uniqueCompanies;
    }
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ role, company }) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const actionType = user.user_roles?.id ? 'updated' : 'assigned';
      const oldRole = user.user_roles?.role || null;
      const oldCompany = user.user_roles?.company || null;

      // If user already has a role, update it
      if (user.user_roles?.id) {
        const { error } = await supabase
          .from('user_roles')
          .update({
            role,
            company,
            assigned_by: currentUser.id
          })
          .eq('id', user.user_roles.id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role,
            company,
            assigned_by: currentUser.id
          });

        if (error) throw error;
      }

      // Log the change in audit log
      const { error: auditError } = await supabase
        .from('role_change_audit_log')
        .insert({
          changed_by: currentUser.id,
          affected_user: userId,
          old_role: oldRole,
          new_role: role,
          old_company: oldCompany,
          new_company: company,
          action_type: actionType
        });

      if (auditError) {
        console.error('Failed to log audit entry:', auditError);
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-role-notification', {
          body: {
            userName: user.full_name,
            userEmail: user.email,
            role,
            company,
            actionType,
            changedBy: currentUser.email
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      return { actionType };
    },
    onSuccess: ({ actionType }) => {
      queryClient.invalidateQueries(['user-details', userId]);
      queryClient.invalidateQueries(['all-users']);
      toast.success(`Role ${actionType} successfully. Notification email sent.`);
      navigate(`/users/${userId}`);
    },
    onError: (error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    const validation = validateRoleAssignment({
      role: selectedRole,
      company: selectedCompany,
      userId: userId
    });

    if (!validation.success) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the validation errors');
      return;
    }

    setValidationErrors({});

    // Confirm action
    const actionType = user.user_roles ? 'update' : 'assign';
    const confirmed = await confirm({
      title: `${actionType === 'update' ? 'Update' : 'Assign'} Role?`,
      description: `Are you sure you want to ${actionType} ${user.full_name}'s role to ${selectedRole} at ${selectedCompany}? ${actionType === 'update' ? 'This will replace their current role.' : 'They will receive an email notification.'}`,
      confirmText: actionType === 'update' ? 'Update Role' : 'Assign Role',
      variant: 'default'
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    await assignRoleMutation.mutateAsync({
      role: selectedRole,
      company: selectedCompany
    });
    setIsSubmitting(false);
  };

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

  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/users/${userId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
        <FormLoadingSkeleton />
      </div>
    );
  }

  if (!permissions.canAssignRoles) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <PermissionDenied 
          message="You don't have permission to assign roles."
          requiredRole="System Administrator"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Dialog />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/users/${userId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            {user.user_roles ? 'Change Role' : 'Assign Role'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign or modify role and permissions for {user.full_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Current user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium text-sm">{user.email}</p>
            </div>
            {user.user_roles && (
              <>
                <div>
                  <Label className="text-muted-foreground">Current Role</Label>
                  <Badge variant="outline" className={`mt-1 ${getRoleBadgeColor(user.user_roles.role)}`}>
                    {user.user_roles.role}
                  </Badge>
                </div>
                {user.user_roles.company && (
                  <div>
                    <Label className="text-muted-foreground">Current Company</Label>
                    <p className="font-medium flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {user.user_roles.company}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Role Assignment Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Role Assignment</CardTitle>
            <CardDescription>
              Select a role and optionally assign to a company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role" className={validationErrors.role ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sysadmin">System Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.role ? (
                  <p className="text-sm text-destructive">{validationErrors.role}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Choose the appropriate role based on required permissions
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger id="company" className={validationErrors.company ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Companies">All Companies (System Admin Only)</SelectItem>
                    <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
                    <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
                    <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
                    {companies?.filter(c => !['All Companies', 'Grand Berna Dairies', 'KAJON Coffee Limited', 'Kyalima Farmers Limited'].includes(c)).map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.company ? (
                  <p className="text-sm text-destructive">{validationErrors.company}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selectedRole === 'sysadmin' 
                      ? 'System admins have access to all companies'
                      : 'Assign user to a specific company for role-based access control'
                    }
                  </p>
                )}
              </div>

              {/* Role Descriptions */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Role Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium">System Administrator</p>
                      <p className="text-muted-foreground text-xs">Full system access - manage all users, companies, and data across the entire system</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Manager</p>
                      <p className="text-muted-foreground text-xs">Full CRUD access - can create, read, update, and delete all data within assigned company</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Staff</p>
                      <p className="text-muted-foreground text-xs">Read-only access - can view all data within assigned company but cannot modify</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedRole}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Assigning...' : user.user_roles ? 'Update Role' : 'Assign Role'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/users/${userId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignRole;
