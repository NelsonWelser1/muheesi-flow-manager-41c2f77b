
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemAdminDashboard from './SystemAdminDashboard';
import CEODashboard from './CEODashboard';

const RoleDashboard = ({ role }) => {
  const renderRoleContent = () => {
    switch (role) {
      case 'System Administrator (SysAdmin)':
        return <SystemAdminDashboard />;
      
      case 'Chief Executive Officer (CEO)':
        return <CEODashboard />;
      
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{role} Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dashboard content for {role} will be implemented here.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">{role}</h2>
      </div>
      {renderRoleContent()}
    </div>
  );
};

export default RoleDashboard;
