
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrganizationalChart from '../components/organization/OrganizationalChart';
import SystemAccounts from '../components/organization/SystemAccounts';
import InternalNotifications from '../components/organization/InternalNotifications';
import RoleDashboard from '../components/organization/RoleDashboard';
import PADashboard from '../components/organization/pa-dashboard/PADashboard';

const ManageCompanies = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    // Add event listener for role selection
    const handleRoleSelected = (event) => {
      setSelectedRole(event.detail);
    };
    
    window.addEventListener('roleSelected', handleRoleSelected);
    
    // Clean up
    return () => {
      window.removeEventListener('roleSelected', handleRoleSelected);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <div className="flex items-center space-x-2">
          <InternalNotifications />
          <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {selectedRole ? (
        selectedRole === "Personal Assistant (PA)" ? (
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedRole(null)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>CEO's Personal Assistant Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <PADashboard />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedRole(null)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
            <RoleDashboard role={selectedRole} />
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>System Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemAccounts />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizational Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationalChart />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageCompanies;
