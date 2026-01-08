import React, { useState } from 'react';
import { useRolesByTier, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  Crown,
  Briefcase,
  UserCog,
  Loader2,
  Lock
} from 'lucide-react';
import { RoleForm } from './RoleForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const TIER_CONFIG = {
  strategic: { 
    label: 'Strategic', 
    icon: Crown, 
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    description: 'Executive and board-level roles'
  },
  tactical: { 
    label: 'Tactical', 
    icon: Briefcase, 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'Manager and supervisor roles'
  },
  operational: { 
    label: 'Operational', 
    icon: UserCog, 
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Staff and operational roles'
  }
};

export const RoleManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  const { data: groupedRoles, roles, isLoading, error } = useRolesByTier();
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  if (permissionsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!permissions.isSysAdmin) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage roles. Only system administrators can access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredRoles = roles?.filter(role => 
    role.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.role_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroupedRoles = filteredRoles?.reduce((acc, role) => {
    const tier = role.tier || 'operational';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(role);
    return acc;
  }, {});

  const handleCreateRole = async (data) => {
    await createRole.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateRole = async (data) => {
    await updateRole.mutateAsync({ id: editingRole.id, ...data });
    setEditingRole(null);
  };

  const handleDeleteRole = async () => {
    if (deletingRole) {
      await deleteRole.mutateAsync(deletingRole.id);
      setDeletingRole(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(j => (
                  <Skeleton key={j} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load roles: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Create and manage roles to control access across your organization
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(TIER_CONFIG).map(([tier, config]) => {
          const TierIcon = config.icon;
          const count = groupedRoles?.[tier]?.length || 0;
          return (
            <Card key={tier}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`p-3 rounded-lg ${config.color}`}>
                  <TierIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{config.label} Roles</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Lists by Tier */}
      {['strategic', 'tactical', 'operational'].map(tier => {
        const config = TIER_CONFIG[tier];
        const tierRoles = filteredGroupedRoles?.[tier] || [];
        const TierIcon = config.icon;

        if (tierRoles.length === 0 && searchQuery) return null;

        return (
          <Card key={tier}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TierIcon className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{config.label}</CardTitle>
              </div>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {tierRoles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No roles in this tier
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tierRoles.map(role => (
                    <div
                      key={role.id}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{role.display_name}</h4>
                          {role.is_system_role && (
                            <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{role.role_key}</p>
                        {role.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {role.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 pt-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {role.user_count} user{role.user_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingRole(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {!role.is_system_role && (
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setDeletingRole(role)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role to your organization. You can configure feature access after creation.
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            onSubmit={handleCreateRole}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createRole.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details. Role key cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <RoleForm
              defaultValues={editingRole}
              onSubmit={handleUpdateRole}
              onCancel={() => setEditingRole(null)}
              isLoading={updateRole.isPending}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRole} onOpenChange={(open) => !open && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRole?.display_name}"? 
              This will remove the role from all users currently assigned to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManager;
