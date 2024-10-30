import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Coffee, Wheat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemAdministrator = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    {
      id: 'grand-berna',
      name: 'Grand Berna Dairies',
      icon: Building2,
      description: 'Dairy Products and Processing'
    },
    {
      id: 'kajon',
      name: 'KAJON Coffee Limited',
      icon: Coffee,
      description: 'Coffee Production and Export'
    },
    {
      id: 'kyalima',
      name: 'Kyalima Farmers Limited',
      icon: Wheat,
      description: 'Agricultural Products and Farming'
    }
  ];

  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
    navigate(`/manage-accounts/${companyId}`);
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="manage-accounts">
          <AccordionTrigger>Manage Accounts</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {companies.map((company) => {
                        const Icon = company.icon;
                        return (
                          <Card 
                            key={company.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleCompanySelect(company.id)}
                          >
                            <CardContent className="flex items-center gap-4 p-4">
                              <Icon className="h-8 w-8" />
                              <div>
                                <h3 className="font-semibold">{company.name}</h3>
                                <p className="text-sm text-muted-foreground">{company.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Manage user permissions and access controls.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system-health">
          <AccordionTrigger>System Health</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log("Managing system health...")}>Check System Health</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system-settings">
          <AccordionTrigger>System Settings</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('System settings updated:', {
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
            <Button onClick={() => console.log('Database operations initiated')}>Backup Database</Button>
            <Button onClick={() => console.log('Database operations initiated')}>Restore Database</Button>
            <Button onClick={() => console.log('Database operations initiated')}>Optimize Database</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-backups">
          <AccordionTrigger>Data Backups</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log('Scheduling backups...')}>Schedule Backups</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security-protocols">
          <AccordionTrigger>Security Protocols</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log('Checking security...')}>Check Security</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="technical-issues">
          <AccordionTrigger>Technical Issues</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log(`Resolving ticket TICKET-001`)}>Resolve Ticket TICKET-001</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="software-updates">
          <AccordionTrigger>Software Updates</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log('Checking for updates...')}>Check for Updates</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="audit-logs">
          <AccordionTrigger>Audit Logs</AccordionTrigger>
          <AccordionContent>
            <Button onClick={() => console.log('Generating audit logs...')}>Generate Audit Logs</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SystemAdministrator;
