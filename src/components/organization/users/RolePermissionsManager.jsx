import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Shield, Users, Database, CheckCircle, Building2, Settings, Lock, RefreshCw } from 'lucide-react';
import { usePermissionDefinitions, useAllRolePermissions } from '@/hooks/useRolePermissions';
import { usePermissions } from '@/hooks/usePermissions';
import RolePermissionCard from './RolePermissionCard';
import PermissionMatrix from './PermissionMatrix';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ROLE_DISPLAY_NAMES = {
  sysadmin: 'System Administrator',
  ceo: 'CEO',
  manager: 'Manager',
  staff: 'Staff',
  hr_manager: 'HR Manager',
  finance_manager: 'Finance Manager',
  operations_manager: 'Operations Manager',
  sales_manager: 'Sales Manager',
  logistics_manager: 'Logistics Manager',
  it_manager: 'IT Manager',
  factory_manager: 'Factory Manager',
  procurement_manager: 'Procurement Manager',
  warehouse_supervisor: 'Warehouse Supervisor',
  compliance_officer: 'Compliance Officer',
  risk_manager: 'Risk Manager',
  board_member: 'Board Member',
  ceo_assistant: 'CEO Assistant',
  inventory_manager: 'Inventory Manager',
  marketing_manager: 'Marketing Manager',
  product_manager: 'Product Manager',
  association_manager: 'Association Manager',
  farm_manager: 'Farm Manager',
};

const CATEGORY_ICONS = {
  'User Management': Users,
  'Data Operations': Database,
  'Approvals': CheckCircle,
  'Module Access': Building2,
  'System Settings': Settings,
};

const RolePermissionsManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  
  const { permissions: userPermissions, isLoading: permissionsLoading } = usePermissions();
  const { data: permissionDefs, isLoading: defsLoading, refetch: refetchDefs } = usePermissionDefinitions();
  const { data: rolePermissions, isLoading: permsLoading, refetch: refetchPerms } = useAllRolePermissions();

  const isLoading = defsLoading || permsLoading || permissionsLoading;

  // Get unique categories
  const categories = useMemo(() => {
    if (!permissionDefs) return [];
    return [...new Set(permissionDefs.map(p => p.category))];
  }, [permissionDefs]);

  // Get unique roles from permissions
  const roles = useMemo(() => {
    if (!rolePermissions) return [];
    return [...new Set(rolePermissions.map(p => p.role))];
  }, [rolePermissions]);

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    if (!permissionDefs) return [];
    return permissionDefs.filter(p => {
      const matchesSearch = p.permission_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [permissionDefs, searchQuery, selectedCategory]);

  // Group permissions by role
  const permissionsByRole = useMemo(() => {
    if (!rolePermissions || !permissionDefs) return {};
    
    const grouped = {};
    roles.forEach(role => {
      grouped[role] = {};
      permissionDefs.forEach(def => {
        const perm = rolePermissions.find(p => p.role === role && p.permission_key === def.permission_key);
        grouped[role][def.permission_key] = perm?.is_enabled || false;
      });
    });
    return grouped;
  }, [rolePermissions, permissionDefs, roles]);

  const handleRefresh = () => {
    refetchDefs();
    refetchPerms();
  };

  // Check if user has permission to manage permissions
  if (!permissionsLoading && !userPermissions.isSysAdmin) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to access this page. Only System Administrators can manage role permissions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Role Permissions Management</CardTitle>
                <CardDescription>Configure what each role can access in the system</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList>
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="matrix">Matrix</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{roles.length}</div>
            <div className="text-sm text-muted-foreground">Total Roles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{permissionDefs?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Permissions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {permissionDefs?.filter(p => p.is_system_critical).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Critical Permissions</div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {roles.map(role => (
            <RolePermissionCard
              key={role}
              role={role}
              displayName={ROLE_DISPLAY_NAMES[role] || role}
              permissions={permissionsByRole[role] || {}}
              permissionDefs={filteredPermissions}
              categoryIcons={CATEGORY_ICONS}
            />
          ))}
        </div>
      ) : (
        <PermissionMatrix
          roles={roles}
          roleDisplayNames={ROLE_DISPLAY_NAMES}
          permissionDefs={filteredPermissions}
          rolePermissions={permissionsByRole}
          categories={categories}
        />
      )}
    </div>
  );
};

export default RolePermissionsManager;
