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
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-details', userId]);
      queryClient.invalidateQueries(['all-users']);
      toast.success('Role assigned successfully');
      navigate(`/users/${userId}`);
    },
    onError: (error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!selectedCompany) {
      toast.error('Please select a company');
      return;
    }

    // Enforce "All Companies" for sysadmin only
    if (selectedRole === 'sysadmin' && selectedCompany !== 'All Companies') {
      toast.error('System Administrators must be assigned to "All Companies"');
      return;
    }

    if (selectedRole !== 'sysadmin' && selectedCompany === 'All Companies') {
      toast.error('Only System Administrators can be assigned to "All Companies"');
      return;
    }

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sysadmin">System Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose the appropriate role based on required permissions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger id="company">
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
                <p className="text-sm text-muted-foreground">
                  {selectedRole === 'sysadmin' 
                    ? 'System admins have access to all companies'
                    : 'Assign user to a specific company for role-based access control'
                  }
                </p>
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
