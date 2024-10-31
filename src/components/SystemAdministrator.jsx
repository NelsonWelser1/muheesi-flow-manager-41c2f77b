import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Coffee, Wheat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";

const SystemAdministrator = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companies = [
    {
      id: 'grand-berna',
      name: 'Grand Berna Dairies',
      icon: Building2,
      description: 'Dairy Products and Processing',
      responsibilities: [
        "Manage dairy production",
        "Quality control",
        "Supply chain oversight",
        "Inventory management"
      ]
    },
    {
      id: 'kajon',
      name: 'KAJON Coffee Limited',
      icon: Coffee,
      description: 'Coffee Production and Export',
      responsibilities: [
        "Coffee processing oversight",
        "Export management",
        "Quality assurance",
        "International trade compliance"
      ]
    },
    {
      id: 'kyalima',
      name: 'Kyalima Farmers Limited',
      icon: Wheat,
      description: 'Agricultural Products and Farming',
      responsibilities: [
        "Farm operations management",
        "Crop planning",
        "Resource allocation",
        "Agricultural compliance"
      ]
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
            <Tabs defaultValue="actions">
              <TabsList className="mb-4">
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="actions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
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
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{company.name}</h3>
                                    <p className="text-sm text-muted-foreground">{company.description}</p>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Manage
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full" variant="outline">Add New Company</Button>
                        <Button className="w-full" variant="outline">Manage User Roles</Button>
                        <Button className="w-full" variant="outline">View Access Logs</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Manage user permissions and access controls for all companies.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">Modify Permissions</Button>
                        <Button variant="outline">View Access Logs</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {companies.map((company) => (
                        <Card key={company.id}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {React.createElement(company.icon, { className: "h-5 w-5" })}
                              {company.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
                            <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {company.responsibilities.map((resp, idx) => (
                                <li key={idx} className="text-muted-foreground">{resp}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
