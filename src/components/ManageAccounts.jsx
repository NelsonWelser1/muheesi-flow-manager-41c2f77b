import React, { useState } from 'react';
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

const accounts = [
  { title: "System Administrator (SysAdmin)", Component: SystemAdministrator },
  { title: "Operations Manager", Component: OperationsManager },
  { title: "Procurement Manager", Component: ProcurementManager },
  { title: "Warehouse Supervisor", Component: WarehouseSupervisor },
  { title: "Farm Manager", Component: FarmManager },
  { title: "Farm Supervisor", Component: FarmSupervisor },
  { title: "Logistics Manager", Component: LogisticsManager },
  { title: "Inventory Manager", Component: InventoryManager },
  { title: "Sales & Export Manager", Component: SalesExportManager },
  { title: "Compliance & Quality Control Officer", Component: ComplianceQualityControl },
  { title: "Finance Manager", Component: FinanceManager }
];

const ManageAccounts = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Accounts</h2>
      <Accordion type="single" collapsible className="w-full">
        {accounts.map((account, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{account.title}</AccordionTrigger>
            <AccordionContent>
              <account.Component />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ManageAccounts;