import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import UserSidebar from '../components/layout/UserSidebar';
import TopNavigation from '../components/layout/TopNavigation';
import SystemAdministrator from '../components/SystemAdministrator';

const ManageCompanies = () => {
  const currentUser = {
    name: "John Doe",
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
          <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
          <TopNavigation>
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <SystemAdministrator />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.primaryActions.map((action, idx) => (
                  <div key={idx} className="p-4 bg-white border rounded-lg shadow">
                    <h3 className="font-medium">{action}</h3>
                    <p className="text-sm text-gray-600">Click to perform this action</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Current Permissions</h3>
                <p className="text-sm text-gray-600">
                  Contact your system administrator to modify permissions.
                </p>
              </div>
            </TabsContent>
          </TopNavigation>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;