import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RoleDescriptions = () => {
  const roles = {
    strategic: [
      {
        title: "Chief Executive Officer (CEO)",
        description: "H.E Maj. Gen. Geoffrey Muheesi leads the organization, setting strategic direction and overseeing all operations. Responsible for major decision-making and company vision.",
      },
      {
        title: "System Administrator (SysAdmin)",
        description: "Manages and maintains IT infrastructure, system security, and user access. Ensures smooth operation of all technical systems.",
      },
      {
        title: "Compliance & Quality Control Officer",
        description: "Ensures adherence to regulatory requirements, maintains quality standards, and oversees audit processes.",
      },
      {
        title: "Risk Manager",
        description: "Identifies and mitigates business risks, develops contingency plans, and ensures business continuity.",
      }
    ],
    tactical: [
      {
        title: "Human Resource Manager",
        description: "Oversees recruitment, training, employee relations, and workforce development.",
      },
      {
        title: "Operations Manager",
        description: "Coordinates daily operations, ensures efficiency, and implements strategic initiatives.",
      },
      {
        title: "Procurement Manager",
        description: "Manages supplier relationships, negotiates contracts, and oversees purchasing processes.",
      },
      {
        title: "Factory Manager",
        description: "Directs manufacturing operations, maintains production standards, and optimizes processes.",
      },
      {
        title: "Finance Manager",
        description: "Manages financial planning, budgeting, and accounting operations.",
      },
      {
        title: "Sales & Export Manager",
        description: "Develops sales strategies, manages client relationships, and oversees export operations.",
      },
      {
        title: "Logistics Manager",
        description: "Coordinates supply chain operations, transportation, and distribution networks.",
      },
      {
        title: "Inventory Manager",
        description: "Maintains optimal stock levels, manages warehouse operations, and tracks inventory.",
      },
      {
        title: "Marketing Manager",
        description: "Develops marketing strategies, manages brand identity, and oversees promotional activities.",
      },
      {
        title: "IT Manager",
        description: "Manages technology infrastructure, provides technical support, and implements IT solutions.",
      },
      {
        title: "Product Development Manager",
        description: "Leads product innovation, manages development cycles, and ensures market alignment.",
      }
    ],
    operational: [
      {
        title: "Warehouse Supervisor",
        description: "Manages daily warehouse operations, oversees inventory storage, and coordinates shipments.",
      },
      {
        title: "Association Manager",
        description: "Maintains relationships with partners and associations, coordinates collaborative initiatives.",
      },
      {
        title: "Farm Manager",
        description: "Oversees agricultural operations, manages farm workers, and ensures optimal production.",
      }
    ]
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="strategic">
        <AccordionTrigger className="text-lg font-semibold">
          Strategic/Executive Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {roles.strategic.map((role, index) => (
              <div key={index} className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary">{role.title}</h3>
                <p className="text-muted-foreground mt-2">{role.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tactical">
        <AccordionTrigger className="text-lg font-semibold">
          Tactical/Departmental Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {roles.tactical.map((role, index) => (
              <div key={index} className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                <h3 className="font-semibold text-secondary">{role.title}</h3>
                <p className="text-muted-foreground mt-2">{role.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="operational">
        <AccordionTrigger className="text-lg font-semibold">
          Operational/Field Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {roles.operational.map((role, index) => (
              <div key={index} className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="font-semibold text-accent">{role.title}</h3>
                <p className="text-muted-foreground mt-2">{role.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RoleDescriptions;