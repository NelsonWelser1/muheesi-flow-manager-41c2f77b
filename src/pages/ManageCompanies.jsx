import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import UserSidebar from '../components/layout/UserSidebar';
import TopNavigation from '../components/layout/TopNavigation';
import SystemAdministrator from '../components/SystemAdministrator';

const ManageCompanies = () => {
  // This would come from your auth context in a real app
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
      
      <div className="flex-1">
        <TopNavigation>
          <TabsContent value="overview">
            <SystemAdministrator />
          </TabsContent>
          
          <TabsContent value="actions">
            <div className="grid grid-cols-2 gap-4">
              {currentUser.primaryActions.map((action, idx) => (
                <div key={idx} className="p-4 border rounded">
                  <h3 className="font-medium">{action}</h3>
                  <p className="text-sm text-gray-600">Click to perform this action</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <div className="p-4">
              <h3 className="font-medium mb-2">Current Permissions</h3>
              <p className="text-sm text-gray-600">
                Contact your system administrator to modify permissions.
              </p>
            </div>
          </TabsContent>
        </TopNavigation>
      </div>
    </div>
  );
};

export default ManageCompanies;