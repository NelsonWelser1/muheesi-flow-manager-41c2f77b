import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SystemAdministrator from '../components/SystemAdministrator';
import { Button } from "@/components/ui/button";

const userRoles = [
  {
    title: "System Administrator (SysAdmin)",
    component: <SystemAdministrator />,
    isAdmin: true
  },
  {
    title: "Chief Executive Officer (CEO) H.E. Rtd. Maj. Gen. Muheesi Geoffrey Baraba",
    responsibilities: [
      "Overall strategic direction",
      "Company performance oversight",
      "Major business decisions",
      "Executive leadership"
    ]
  },
  {
    title: "Operations Manager",
    responsibilities: [
      "Daily operations oversight",
      "Resource allocation",
      "Performance monitoring",
      "Process optimization"
    ]
  },
  {
    title: "Farm Supervisor",
    responsibilities: [
      "Farm operations management",
      "Crop monitoring",
      "Worker supervision",
      "Production reporting"
    ]
  },
  {
    title: "Warehouse Manager",
    responsibilities: [
      "Inventory oversight",
      "Storage management",
      "Stock control",
      "Warehouse operations"
    ]
  },
  {
    title: "Coffee Store Manager",
    responsibilities: [
      "Coffee stock management",
      "Quality maintenance",
      "Storage conditions",
      "Inventory tracking"
    ]
  },
  {
    title: "Logistics Manager",
    responsibilities: [
      "Transportation coordination",
      "Supply chain management",
      "Delivery scheduling",
      "Route optimization"
    ]
  },
  {
    title: "Inventory Manager",
    responsibilities: [
      "Stock level monitoring",
      "Inventory control",
      "Stock reporting",
      "Supply management"
    ]
  },
  {
    title: "Finance Manager",
    responsibilities: [
      "Financial oversight",
      "Budget management",
      "Cost control",
      "Financial reporting"
    ]
  },
  {
    title: "Sales and Marketing Manager",
    responsibilities: [
      "Sales strategy",
      "Market development",
      "Client relations",
      "Revenue growth"
    ]
  },
  {
    title: "Coffee Quality Analyst",
    responsibilities: [
      "Quality assessment",
      "Sample analysis",
      "Standards compliance",
      "Quality reporting"
    ]
  },
  {
    title: "General Data Clerk",
    responsibilities: [
      "Data entry",
      "Record keeping",
      "Document management",
      "Report generation"
    ]
  }
];

const ManageCompanies = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
      
      <Accordion type="single" collapsible className="w-full mb-8">
        {userRoles.map((role, index) => (
          <AccordionItem key={index} value={`role-${index}`}>
            <AccordionTrigger>{role.title}</AccordionTrigger>
            <AccordionContent>
              {role.isAdmin ? (
                role.component
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Responsibilities:</h3>
                  <ul className="list-disc pl-5">
                    {role.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-4">
                    <Button>View Dashboard</Button>
                    <Button variant="outline">Manage Permissions</Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ManageCompanies;