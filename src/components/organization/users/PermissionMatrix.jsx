import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Lock, Save, X, AlertTriangle } from 'lucide-react';
import { useUpdateRolePermission } from '@/hooks/useRolePermissions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

const PermissionMatrix = ({ roles, roleDisplayNames, permissionDefs, rolePermissions, categories }) => {
  const [pendingChanges, setPendingChanges] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const updatePermission = useUpdateRolePermission();

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const pendingCount = Object.keys(pendingChanges).length;

  const getChangeKey = (role, permissionKey) => `${role}:${permissionKey}`;

  const handleToggle = (role, permissionKey, currentValue, isSystemCritical) => {
    if (isSystemCritical && role === 'sysadmin') {
      toast({
        title: "Cannot modify",
        description: "System-critical permissions cannot be disabled for System Administrator role.",
        variant: "destructive",
      });
      return;
    }

    const key = getChangeKey(role, permissionKey);
    const newValue = !currentValue;
    
    setPendingChanges(prev => {
      const updated = { ...prev };
      const originalValue = rolePermissions[role]?.[permissionKey] || false;
      
      if (newValue === originalValue) {
        delete updated[key];
      } else {
        updated[key] = { role, permissionKey, isEnabled: newValue };
      }
      return updated;
    });
  };

  const getPermissionValue = (role, permissionKey) => {
    const key = getChangeKey(role, permissionKey);
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key].isEnabled;
    }
    return rolePermissions[role]?.[permissionKey] || false;
  };

  const isPending = (role, permissionKey) => {
    const key = getChangeKey(role, permissionKey);
    return pendingChanges[key] !== undefined;
  };

  const isLocked = (role, def) => {
    return def.is_system_critical && role === 'sysadmin';
  };

  const handleSave = async () => {
    setShowConfirmDialog(false);
    try {
      for (const change of Object.values(pendingChanges)) {
        await updatePermission.mutateAsync({
          role: change.role,
          permissionKey: change.permissionKey,
          isEnabled: change.isEnabled,
        });
      }
      setPendingChanges({});
      toast({
        title: "Permissions updated",
        description: `Successfully applied ${pendingCount} permission changes.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update some permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setPendingChanges({});
  };

  // Group permissions by category for display
  const groupedByCategory = categories.reduce((acc, category) => {
    acc[category] = permissionDefs.filter(p => p.category === category);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Permission Matrix</CardTitle>
          {hasPendingChanges && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{pendingCount} pending changes</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={updatePermission.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={updatePermission.isPending}
              >
                <Save className="h-4 w-4 mr-1" />
                Save All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64 sticky left-0 bg-background z-10">Permission</TableHead>
                  {roles.map(role => (
                    <TableHead key={role} className="text-center min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">
                          {roleDisplayNames[role] || role}
                        </span>
                        {role === 'sysadmin' && (
                          <Badge variant="destructive" className="text-xs px-1">Admin</Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedByCategory).map(([category, defs]) => (
                  <React.Fragment key={category}>
                    {/* Category header row */}
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell 
                        colSpan={roles.length + 1} 
                        className="font-semibold text-sm sticky left-0 bg-muted/50"
                      >
                        {category}
                      </TableCell>
                    </TableRow>
                    {/* Permission rows */}
                    {defs.map(def => (
                      <TableRow key={def.permission_key}>
                        <TableCell className="sticky left-0 bg-background">
                          <div className="flex items-center gap-2">
                            {def.is_system_critical && (
                              <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            )}
                            <div>
                              <div className="font-medium text-sm">{def.permission_name}</div>
                              {def.description && (
                                <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                                  {def.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        {roles.map(role => {
                          const isEnabled = getPermissionValue(role, def.permission_key);
                          const locked = isLocked(role, def);
                          const pending = isPending(role, def.permission_key);
                          
                          return (
                            <TableCell 
                              key={`${role}-${def.permission_key}`} 
                              className={cn(
                                "text-center",
                                pending && "bg-primary/5"
                              )}
                            >
                              <div className="flex justify-center">
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={() => handleToggle(
                                    role, 
                                    def.permission_key, 
                                    isEnabled, 
                                    def.is_system_critical
                                  )}
                                  disabled={locked || updatePermission.isPending}
                                  className="scale-90"
                                />
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Permission Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to apply {pendingCount} permission changes. This will affect how users with these roles can interact with the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-48 overflow-y-auto my-4">
            <div className="space-y-2">
              {Object.values(pendingChanges).map(change => (
                <div 
                  key={`${change.role}-${change.permissionKey}`}
                  className="flex items-center justify-between text-sm p-2 bg-muted rounded-md"
                >
                  <span>
                    <span className="font-medium">{roleDisplayNames[change.role] || change.role}</span>
                    <span className="text-muted-foreground"> → </span>
                    {change.permissionKey}
                  </span>
                  <Badge variant={change.isEnabled ? "default" : "secondary"}>
                    {change.isEnabled ? "Enable" : "Disable"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Apply Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PermissionMatrix;
