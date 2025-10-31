import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

const SystemAdministrator = () => {
  const navigate = useNavigate();
  const [systemHealth, setSystemHealth] = useState({});
  const [backupSchedule, setBackupSchedule] = useState({});
  const [securityAlerts, setSecurityAlerts] = useState([]);

  const handleSystemOperation = (operation) => {
    console.log(`Executing operation: ${operation}`);
    // Implementation remains the same
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="system-management">
          <AccordionTrigger>System Management</AccordionTrigger>
          <AccordionContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleSystemOperation('health')}
                  >
                    Check System Health
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleSystemOperation('backup')}
                  >
                    Schedule Backups
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleSystemOperation('security')}
                  >
                    Security Protocols
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleSystemOperation('software')}
                  >
                    Software Updates
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="actions">
                <div className="space-y-4">
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">System Status</h3>
                    {Object.entries(systemHealth).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-600">{key}: {value}</p>
                    ))}
                  </section>

                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Backup Information</h3>
                    {Object.entries(backupSchedule).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-600">{key}: {value}</p>
                    ))}
                  </section>

                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Security Alerts</h3>
                    {securityAlerts.map((alert, index) => (
                      <p key={index} className={`text-sm ${alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {alert.message}
                      </p>
                    ))}
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="permissions">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Access Control</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">Modify Permissions</Button>
                    <Button variant="outline">View Access Logs</Button>
                    <Button variant="outline">User Management</Button>
                    <Button variant="outline">Role Configuration</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manage-accounts">
          <AccordionTrigger>Manage Accounts</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <p className="text-muted-foreground mb-4">
                Access the comprehensive user management system to manage accounts, roles, and permissions.
              </p>
              <Button onClick={() => navigate('/manage-accounts')}>
                Open User Management
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SystemAdministrator;
