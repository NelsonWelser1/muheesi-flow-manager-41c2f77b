import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';
import TopNavigation from '../components/layout/TopNavigation';
import SystemAdministrator from '../components/SystemAdministrator';

const ManageCompanies = () => {
  const navigate = useNavigate();
  const currentUser = {
    name: "Welser",
    role: "System Administrator (SysAdmin)",
    primaryActions: [
      "System Health",
      "System Settings",
      "Database Operations",
      "Data Backups",
      "Security Protocols",
      "Technical Issues",
      "Software Updates",
      "Audit Logs",
      "System Alerts",
      "Manage Accounts"
    ]
  };

  return (
    <div className="flex h-screen">
      <UserSidebar 
        user={currentUser}
        primaryActions={currentUser.primaryActions}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Companies</h1>
            <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <TopNavigation>
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <SystemAdministrator />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.primaryActions.map((action, idx) => (
                  <Card key={idx} className="p-4 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h3 className="font-medium">{action}</h3>
                    <p className="text-sm text-gray-600">Click to perform this action</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              <Card className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Current Permissions</h3>
                <p className="text-sm text-gray-600">
                  Contact your system administrator to modify permissions.
                </p>
              </Card>
            </TabsContent>
          </TopNavigation>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;