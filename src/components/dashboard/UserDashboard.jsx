import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRole, useUserProfile } from '@/integrations/supabase/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UserDashboard = () => {
  const { data: role, isLoading: roleLoading } = useUserRole();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (roleLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Role Assigned</AlertTitle>
              <AlertDescription>
                You don't have a role assigned yet. Please contact a system administrator to assign you a role and grant access to specific features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {role && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Role Active</AlertTitle>
          <AlertDescription>
            Your role grants you access to specific dashboards and features. Navigate using the menu above to access your workspace.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserDashboard;
