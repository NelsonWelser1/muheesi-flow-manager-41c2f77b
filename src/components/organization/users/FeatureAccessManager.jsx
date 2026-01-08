import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, RefreshCw, Shield, LayoutGrid, Table as TableIcon,
  CheckCircle, XCircle, Eye, Edit, Zap, AlertTriangle
} from 'lucide-react';
import { useFeatureDefinitions, useRoleFeatureAccess } from '@/hooks/useFeatureAccess';
import { useUpdateRoleFeatureAccess, useApplyRoleTemplate } from '@/hooks/useRoleFeatureAccess';
import { usePermissions } from '@/hooks/usePermissions';
import { useAvailableRoles } from '@/hooks/useRolePermissions';
import { useToast } from '@/hooks/use-toast';

const ROLE_DISPLAY_NAMES = {
  sysadmin: 'System Admin',
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
  farm_manager: 'Farm Manager'
};

const ACCESS_LEVEL_COLORS = {
  view: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  edit: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  full: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
};

const ACCESS_LEVEL_ICONS = {
  view: Eye,
  edit: Edit,
  full: Zap
};

const FeatureAccessManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRole, setSelectedRole] = useState('');
  const [viewMode, setViewMode] = useState('matrix');
  
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  
  const { data: features = [], isLoading: featuresLoading, refetch: refetchFeatures } = useFeatureDefinitions();
  const { data: roleAccess = [], isLoading: accessLoading, refetch: refetchAccess } = useRoleFeatureAccess();
  const { data: availableRoles = [] } = useAvailableRoles();
  
  const updateAccess = useUpdateRoleFeatureAccess();
  const applyTemplate = useApplyRoleTemplate();

  const isLoading = featuresLoading || accessLoading;

  // Get unique categories from features
  const categories = useMemo(() => {
    const cats = [...new Set(features.map(f => f.category))];
    return cats.sort();
  }, [features]);

  // Filter features based on search and category
  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      const matchesSearch = !searchQuery || 
        feature.feature_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.feature_key.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        feature.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [features, searchQuery, selectedCategory]);

  // Build access matrix: role -> feature_key -> access info
  const accessMatrix = useMemo(() => {
    const matrix = {};
    
    // Initialize all roles
    availableRoles.forEach(role => {
      matrix[role] = {};
    });
    
    // Fill in access data
    roleAccess.forEach(access => {
      if (!matrix[access.role]) matrix[access.role] = {};
      matrix[access.role][access.feature_key] = {
        id: access.id,
        accessLevel: access.access_level,
        isEnabled: access.is_enabled,
        company: access.company
      };
    });
    
    return matrix;
  }, [roleAccess, availableRoles]);

  const handleToggleAccess = async (role, featureKey, currentAccess) => {
    const newEnabled = !(currentAccess?.isEnabled ?? false);
    
    await updateAccess.mutateAsync({
      role,
      featureKey,
      accessLevel: currentAccess?.accessLevel || 'view',
      isEnabled: newEnabled
    });
  };

  const handleChangeAccessLevel = async (role, featureKey, newLevel) => {
    const currentAccess = accessMatrix[role]?.[featureKey];
    
    await updateAccess.mutateAsync({
      role,
      featureKey,
      accessLevel: newLevel,
      isEnabled: currentAccess?.isEnabled ?? true
    });
  };

  const handleApplyTemplate = async (role, templateName) => {
    await applyTemplate.mutateAsync({ role, templateName });
  };

  const handleRefresh = () => {
    refetchFeatures();
    refetchAccess();
    toast({
      title: 'Refreshed',
      description: 'Feature access data has been refreshed.'
    });
  };

  // Check if user has permission to manage feature access
  if (!hasPermission('manage_roles')) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage feature access.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Feature Access Manager
          </h2>
          <p className="text-muted-foreground">
            Configure which features each role can access
          </p>
        </div>
        
        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {availableRoles.filter(r => !['sysadmin', 'ceo'].includes(r)).map(role => (
                  <SelectItem key={role} value={role}>
                    {ROLE_DISPLAY_NAMES[role] || role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="matrix" className="gap-1">
                  <TableIcon className="h-4 w-4" />
                  Matrix
                </TabsTrigger>
                <TabsTrigger value="cards" className="gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{features.length}</div>
            <p className="text-sm text-muted-foreground">Total Features</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{availableRoles.length}</div>
            <p className="text-sm text-muted-foreground">Total Roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{roleAccess.filter(a => a.is_enabled).length}</div>
            <p className="text-sm text-muted-foreground">Active Permissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {viewMode === 'matrix' ? (
        <Card>
          <CardContent className="pt-6 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">
                    Feature
                  </TableHead>
                  {(selectedRole ? [selectedRole] : availableRoles.filter(r => !['sysadmin', 'ceo'].includes(r))).map(role => (
                    <TableHead key={role} className="text-center min-w-[120px]">
                      {ROLE_DISPLAY_NAMES[role] || role}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeatures.map(feature => (
                  <TableRow key={feature.feature_key}>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium">
                      <div>
                        <div>{feature.feature_name}</div>
                        <div className="text-xs text-muted-foreground">{feature.category}</div>
                      </div>
                    </TableCell>
                    {(selectedRole ? [selectedRole] : availableRoles.filter(r => !['sysadmin', 'ceo'].includes(r))).map(role => {
                      const access = accessMatrix[role]?.[feature.feature_key];
                      const AccessIcon = access?.accessLevel ? ACCESS_LEVEL_ICONS[access.accessLevel] : null;
                      
                      return (
                        <TableCell key={role} className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              checked={access?.isEnabled ?? false}
                              onCheckedChange={() => handleToggleAccess(role, feature.feature_key, access)}
                              disabled={updateAccess.isPending}
                            />
                            {access?.isEnabled && (
                              <Select
                                value={access.accessLevel}
                                onValueChange={(level) => handleChangeAccessLevel(role, feature.feature_key, level)}
                                disabled={updateAccess.isPending}
                              >
                                <SelectTrigger className="h-6 w-16 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="view">View</SelectItem>
                                  <SelectItem value="edit">Edit</SelectItem>
                                  <SelectItem value="full">Full</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(selectedRole ? [selectedRole] : availableRoles.filter(r => !['sysadmin', 'ceo'].includes(r))).map(role => (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {ROLE_DISPLAY_NAMES[role] || role}
                </CardTitle>
                <CardDescription>
                  {Object.values(accessMatrix[role] || {}).filter(a => a.isEnabled).length} features enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-auto">
                  {filteredFeatures.map(feature => {
                    const access = accessMatrix[role]?.[feature.feature_key];
                    
                    return (
                      <div key={feature.feature_key} className="flex items-center justify-between py-1 border-b last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{feature.feature_name}</div>
                          <div className="text-xs text-muted-foreground">{feature.category}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {access?.isEnabled && (
                            <Badge className={ACCESS_LEVEL_COLORS[access.accessLevel]}>
                              {access.accessLevel}
                            </Badge>
                          )}
                          <Switch
                            checked={access?.isEnabled ?? false}
                            onCheckedChange={() => handleToggleAccess(role, feature.feature_key, access)}
                            disabled={updateAccess.isPending}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureAccessManager;
