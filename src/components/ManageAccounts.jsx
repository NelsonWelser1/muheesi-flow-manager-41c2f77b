import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SystemAdministrator from './accounts/SystemAdministrator';
import OperationsManager from './accounts/OperationsManager';
import ProcurementManager from './accounts/ProcurementManager';
import WarehouseSupervisor from './accounts/WarehouseSupervisor';
import FarmManager from './accounts/FarmManager';
import FarmSupervisor from './accounts/FarmSupervisor';
import LogisticsManager from './accounts/LogisticsManager';
import InventoryManager from './accounts/InventoryManager';
import SalesExportManager from './accounts/SalesExportManager';
import ComplianceQualityControl from './accounts/ComplianceQualityControl';
import FinanceManager from './accounts/FinanceManager';

const initialAccounts = [
  { title: "System Administrator (SysAdmin)", component: SystemAdministrator },
  { title: "Operations Manager", component: OperationsManager },
  { title: "Procurement Manager", component: ProcurementManager },
  { title: "Warehouse Supervisor", component: WarehouseSupervisor },
  { title: "Farm Manager", component: FarmManager },
  { title: "Farm Supervisor", component: FarmSupervisor },
  { title: "Logistics Manager", component: LogisticsManager },
  { title: "Inventory Manager", component: InventoryManager },
  { title: "Sales & Export Manager", component: SalesExportManager },
  { title: "Compliance & Quality Control Officer", component: ComplianceQualityControl },
  { title: "Finance Manager", component: FinanceManager }
];

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [newResponsibilities, setNewResponsibilities] = useState(['']);

  const handleAddAccount = (e) => {
    e.preventDefault();
    const newAccount = {
      title: newAccountTitle,
      responsibilities: newResponsibilities.filter(r => r.trim() !== '')
    };
    setAccounts([...accounts, newAccount]);
    setNewAccountTitle('');
    setNewResponsibilities(['']);
  };

  const handleAddResponsibilityField = () => {
    setNewResponsibilities([...newResponsibilities, '']);
  };

  const handleResponsibilityChange = (index, value) => {
    const updatedResponsibilities = [...newResponsibilities];
    updatedResponsibilities[index] = value;
    setNewResponsibilities(updatedResponsibilities);
  };

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {accounts.map((account, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{account.title}</AccordionTrigger>
            <AccordionContent>
              {account.component ? <account.component /> : (
                <div>
                  <h3>Responsibilities:</h3>
                  <ul>
                    {account.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Add New Account</h3>
        <form onSubmit={handleAddAccount}>
          <div className="mb-2">
            <Label htmlFor="accountTitle">Account Title</Label>
            <Input
              id="accountTitle"
              value={newAccountTitle}
              onChange={(e) => setNewAccountTitle(e.target.value)}
              required
            />
          </div>
          {newResponsibilities.map((responsibility, index) => (
            <div key={index} className="mb-2">
              <Label htmlFor={`responsibility-${index}`}>Responsibility {index + 1}</Label>
              <Input
                id={`responsibility-${index}`}
                value={responsibility}
                onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <Button type="button" onClick={handleAddResponsibilityField}>Add Another Responsibility</Button>
          <Button type="submit" className="ml-2">Add Account</Button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccounts;