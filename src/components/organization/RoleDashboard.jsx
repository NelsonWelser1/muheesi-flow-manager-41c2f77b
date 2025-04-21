
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CEODashboard from '../executive/CEODashboard';

const RoleDashboard = ({ role }) => {
  // If the role is CEO, render the CEO dashboard
  if (role === "Chief Executive Officer (CEO)") {
    return <CEODashboard />;
  }

  // For other roles, render the default dashboard
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{role} Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Role Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This dashboard is configured for {role}.</p>
          <p className="mt-4">You can view and manage your responsibilities here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleDashboard;
