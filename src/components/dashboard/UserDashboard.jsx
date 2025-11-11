import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRole, useUserProfile } from '@/integrations/supabase/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RoleDashboard from '@/components/organization/RoleDashboard';
import AssignAdminHelper from '@/components/admin/AssignAdminHelper';

// Map enum values to full role titles
const roleMapping = {
  'sysadmin': 'System Administrator (SysAdmin)',
  'ceo': 'Chief Executive Officer (CEO)',
  'board_member': 'Board of Directors',
  'pa': "CEO's Personal Assistant",
  'compliance_officer': 'Compliance & Quality Control Officer',
  'hr_manager': 'Human Resource Manager',
  'operations_manager': 'Operations Manager',
  'procurement_manager': 'Procurement Manager',
  'factory_manager': 'Factory Manager',
  'risk_manager': 'Risk Manager',
  'finance_manager': 'Finance Manager',
  'sales_export_manager': 'Sales & Export Manager',
  'logistics_manager': 'Logistics Manager',
  'inventory_manager': 'Inventory Manager',
  'marketing_manager': 'Marketing Manager',
  'it_manager': 'IT Manager',
  'product_development_manager': 'Product Development Manager',
  'warehouse_supervisor': 'Warehouse Supervisor',
  'association_manager': 'Association Manager',
  'farm_manager': 'Farm Manager',
};

const UserDashboard = () => {
  const { data: role, isLoading: roleLoading, error: roleError } = useUserRole();
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();

  if (roleLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle errors gracefully
  if (roleError || profileError) {
    console.error('Dashboard errors:', { roleError, profileError });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {profile?.full_name || 'User'}!</CardTitle>
          <CardDescription>Your account overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Email</p>
            <p className="font-medium">{profile?.email}</p>
          </div>
          
          {role ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Role</p>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-sm">
                  {role.role.replace(/_/g, ' ').toUpperCase()}
                </Badge>
                {role.company && (
                  <Badge variant="outline" className="text-sm">
                    {role.company}
                  </Badge>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!role && <AssignAdminHelper />}

      {role && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Role Active</AlertTitle>
          <AlertDescription>
            Your role grants you access to specific dashboards and features. Your personalized dashboard is displayed below.
          </AlertDescription>
        </Alert>
      )}

      {role && roleMapping[role.role] && (
        <RoleDashboard role={roleMapping[role.role]} />
      )}
    </div>
  );
};

export default UserDashboard;
