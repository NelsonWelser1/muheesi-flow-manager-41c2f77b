import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import AccountsChart from './AccountsChart';
import AddAccountForm from './AddAccountForm';

const companyAccounts = {
  'Grand Berna Limited': [
    'Operations Manager',
    'Procurement Manager',
    'Warehouse Supervisor',
    'Farm Manager',
    'Logistics Manager',
    'Inventory Manager',
    'Sales & Export Manager',
    'Compliance & Quality Control Officer',
    'Finance Manager'
  ],
  'KAJON Coffee Limited': [
    'Operations Manager',
    'Procurement Manager',
    'Warehouse Supervisor',
    'Farm Manager',
    'Logistics Manager',
    'Inventory Manager',
    'Sales & Export Manager',
    'Compliance & Quality Control Officer',
    'Finance Manager'
  ],
  'Kyalima Farmers Limited': [
    'Operations Manager',
    'Procurement Manager',
    'Warehouse Supervisor',
    'Farm Manager',
    'Logistics Manager',
    'Inventory Manager',
    'Sales & Export Manager',
    'Compliance & Quality Control Officer',
    'Finance Manager'
  ]
};

const ManageAccounts = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Accounts</h2>
      <p className="text-muted-foreground">Select an action to perform for Manage Accounts</p>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(companyAccounts).map(([company, employees]) => (
                <AccordionItem key={company} value={company}>
                  <AccordionTrigger>{company}</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      {employees.map((employee, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span>{employee}</span>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Employees Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountsChart companyAccounts={companyAccounts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <AddAccountForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageAccounts;