import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CompanyAccounts = ({ companyAccounts, setCompanyAccounts, onAddEmployee }) => {
  const handleAddEmployee = (companyIndex, employeeTitle) => {
    onAddEmployee(companyIndex, { title: employeeTitle, responsibilities: [] });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Company Accounts</h2>
      <Accordion type="single" collapsible>
        {companyAccounts.map((company, companyIndex) => (
          <AccordionItem key={companyIndex} value={`company-${companyIndex}`}>
            <AccordionTrigger>{company.name}</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-xl font-semibold mb-2">Employees</h3>
              <ul className="list-disc pl-5 mb-4">
                {company.employees.map((employee, employeeIndex) => (
                  <li key={employeeIndex}>{employee.title}</li>
                ))}
              </ul>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="New employee title" 
                  id={`new-employee-${companyIndex}`}
                />
                <Button onClick={() => handleAddEmployee(companyIndex, document.getElementById(`new-employee-${companyIndex}`).value)}>
                  Add Employee
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CompanyAccounts;