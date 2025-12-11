import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Shield, Lock, Save, X } from 'lucide-react';
import { useUpdateRolePermission } from '@/hooks/useRolePermissions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const RolePermissionCard = ({ role, displayName, permissions, permissionDefs, categoryIcons }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const { toast } = useToast();
  const updatePermission = useUpdateRolePermission();

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const grouped = {};
    permissionDefs.forEach(def => {
      if (!grouped[def.category]) {
        grouped[def.category] = [];
      }
      grouped[def.category].push(def);
    });
    return grouped;
  }, [permissionDefs]);

  // Count enabled permissions
  const enabledCount = useMemo(() => {
    return permissionDefs.filter(def => {
      const pending = pendingChanges[def.permission_key];
      return pending !== undefined ? pending : permissions[def.permission_key];
    }).length;
  }, [permissionDefs, permissions, pendingChanges]);

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const handleToggle = (permissionKey, currentValue, isSystemCritical) => {
    if (isSystemCritical && role === 'sysadmin') {
      toast({
        title: "Cannot modify",
        description: "System-critical permissions cannot be disabled for System Administrator role.",
        variant: "destructive",
      });
      return;
    }

    const newValue = !currentValue;
    setPendingChanges(prev => {
      const updated = { ...prev };
      if (newValue === permissions[permissionKey]) {
        delete updated[permissionKey];
      } else {
        updated[permissionKey] = newValue;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      for (const [permissionKey, isEnabled] of Object.entries(pendingChanges)) {
        await updatePermission.mutateAsync({
          role,
          permissionKey,
          isEnabled,
        });
      }
      setPendingChanges({});
      toast({
        title: "Permissions updated",
        description: `Successfully updated permissions for ${displayName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setPendingChanges({});
  };

  const getPermissionValue = (permissionKey) => {
    if (pendingChanges[permissionKey] !== undefined) {
      return pendingChanges[permissionKey];
    }
    return permissions[permissionKey] || false;
  };

  const isLocked = (def) => {
    return def.is_system_critical && role === 'sysadmin';
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      hasPendingChanges && "ring-2 ring-primary/50"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded-md">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  role === 'sysadmin' ? "bg-destructive/10" : "bg-primary/10"
                )}>
                  <Shield className={cn(
                    "h-5 w-5",
                    role === 'sysadmin' ? "text-destructive" : "text-primary"
                  )} />
                </div>
                <div>
                  <CardTitle className="text-base">{displayName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {enabledCount}/{permissionDefs.length} enabled
                    </Badge>
                    {role === 'sysadmin' && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-2 space-y-4">
            {Object.entries(groupedPermissions).map(([category, defs]) => {
              const CategoryIcon = categoryIcons[category] || Shield;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CategoryIcon className="h-4 w-4" />
                    {category}
                  </div>
                  <div className="space-y-1 pl-6">
                    {defs.map(def => {
                      const isEnabled = getPermissionValue(def.permission_key);
                      const locked = isLocked(def);
                      const isPending = pendingChanges[def.permission_key] !== undefined;
                      
                      return (
                        <div
                          key={def.permission_key}
                          className={cn(
                            "flex items-center justify-between py-2 px-2 rounded-md",
                            isPending && "bg-primary/5",
                            locked && "opacity-75"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                            <div>
                              <div className="text-sm font-medium">{def.permission_name}</div>
                              {def.description && (
                                <div className="text-xs text-muted-foreground">{def.description}</div>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => handleToggle(def.permission_key, isEnabled, def.is_system_critical)}
                            disabled={locked || updatePermission.isPending}
                            className={isPending ? "data-[state=checked]:bg-primary" : ""}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Save/Cancel buttons */}
            {hasPendingChanges && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
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
                  onClick={handleSave}
                  disabled={updatePermission.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RolePermissionCard;
