import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SystemAdministrator from '../components/SystemAdministrator';

const ManageCompanies = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
      
      <Accordion type="single" collapsible className="w-full mb-8">
        <AccordionItem value="system-admin">
          <AccordionTrigger>System Administrator (SysAdmin)</AccordionTrigger>
          <AccordionContent>
            <SystemAdministrator />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ManageCompanies;