import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ManageAccounts from './ManageAccounts';

const SystemAdministrator = () => {
  const [systemHealth, setSystemHealth] = useState({});
  const [backupSchedule, setBackupSchedule] = useState({});
  const [securityAlerts, setSecurityAlerts] = useState([]);

  const manageSystemHealth = () => {
    setSystemHealth({
      uptime: '99.9%',
      cpuUsage: '45%',
      memoryUsage: '60%',
    });
  };

  const configureSystemSettings = (settings) => {
    console.log('System settings updated:', settings);
  };

  const manageDatabaseOperations = () => {
    console.log('Database operations initiated');
  };

  const scheduleDataBackups = () => {
    setBackupSchedule({
      frequency: 'Daily',
      time: '02:00 AM',
      retention: '30 days',
    });
  };

  const enforceSecurityProtocols = () => {
    setSecurityAlerts([
      { type: 'warning', message: 'Weak password detected for user john@example.com' },
      { type: 'critical', message: 'Multiple failed login attempts from IP 192.168.1.100' },
    ]);
  };

  const resolveTechnicalIssues = (ticketId) => {
    console.log(`Resolving ticket ${ticketId}`);
  };

  const updateSystemSoftware = () => {
    console.log('Initiating system software update');
  };

  const generateAuditLogs = () => {
    console.log('Generating audit logs');
  };

  const sendSystemAlerts = (alertType, message) => {
    console.log(`Sending ${alertType} alert: ${message}`);
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="system-health">
          <AccordionTrigger>System Health</AccordionTrigger>
          <AccordionContent>
            <Button onClick={manageSystemHealth}>Check System Health</Button>
            {Object.entries(systemHealth).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system-settings">
          <AccordionTrigger>System Settings</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              configureSystemSettings({
                emailServer: e.target.emailServer.value,
                storageLimit: e.target.storageLimit.value,
              });
            }}>
              <Label htmlFor="emailServer">Email Server</Label>
              <Input id="emailServer" name="emailServer" />
              <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
              <Input id="storageLimit" name="storageLimit" type="number" />
              <Button type="submit">Update Settings</Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="database-operations">
          <AccordionTrigger>Database Operations</AccordionTrigger>
          <AccordionContent>
            <Button onClick={manageDatabaseOperations}>Backup Database</Button>
            <Button onClick={manageDatabaseOperations}>Restore Database</Button>
            <Button onClick={manageDatabaseOperations}>Optimize Database</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-backups">
          <AccordionTrigger>Data Backups</AccordionTrigger>
          <AccordionContent>
            <Button onClick={scheduleDataBackups}>Schedule Backups</Button>
            {Object.entries(backupSchedule).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security-protocols">
          <AccordionTrigger>Security Protocols</AccordionTrigger>
          <AccordionContent>
            <Button onClick={enforceSecurityProtocols}>Check Security</Button>
            {securityAlerts.map((alert, index) => (
              <p key={index} className={alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'}>
                {alert.message}
              </p>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="technical-issues">
          <AccordionTrigger>Technical Issues</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => resolveTechnicalIssues('TICKET-001')}>Resolve Ticket TICKET-001</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="software-updates">
          <AccordionTrigger>Software Updates</AccordionTrigger>
          <AccordionContent>
            <Button onClick={updateSystemSoftware}>Check for Updates</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="audit-logs">
          <AccordionTrigger>Audit Logs</AccordionTrigger>
          <AccordionContent>
            <Button onClick={generateAuditLogs}>Generate Audit Logs</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system-alerts">
          <AccordionTrigger>System Alerts</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => sendSystemAlerts('critical', 'Disk space running low')}>
              Send Test Alert
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manage-accounts">
          <AccordionTrigger>Manage Accounts</AccordionTrigger>
          <AccordionContent>
            <ManageAccounts />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SystemAdministrator;