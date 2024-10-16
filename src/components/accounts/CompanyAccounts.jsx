import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CompanyAccounts = ({ companyAccounts }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Company Accounts</h2>
      <Accordion type="single" collapsible>
        {companyAccounts.map((company, index) => (
          <AccordionItem key={index} value={`company-${index}`}>
            <AccordionTrigger>{company.name}</AccordionTrigger>
            <AccordionContent>
              <p>Employee accounts will be added here in the next iteration.</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CompanyAccounts;