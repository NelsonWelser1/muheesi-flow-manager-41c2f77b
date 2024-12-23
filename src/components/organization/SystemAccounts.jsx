import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthenticationForm from '../inventory/kajon/AuthenticationForm';
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Shield, AlertOctagon, Users, Warehouse, Tractor } from 'lucide-react';

const SystemAccounts = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAuthenticate = (managerName) => {
    console.log("Authenticating:", managerName, "for role:", selectedRole);
    toast({
      title: "Authentication Successful",
      description: `Logged in as ${managerName} - ${selectedRole}`,
    });
  };

  const roles = {
    strategic: [
      {
        title: "Chief Executive Officer (CEO)",
        description: "H.E Maj. Gen. Geoffrey Muheesi leads the organization, setting strategic direction and overseeing all operations.",
        icon: <User className="h-6 w-6 text-blue-600" />
      },
      {
        title: "System Administrator (SysAdmin)",
        description: "Manages and maintains IT infrastructure, system security, and user access.",
        icon: <Settings className="h-6 w-6 text-blue-600" />
      },
      {
        title: "Compliance & Quality Control Officer",
        description: "Ensures adherence to regulatory requirements and maintains quality standards.",
        icon: <Shield className="h-6 w-6 text-blue-600" />
      },
      {
        title: "Risk Manager",
        description: "Identifies and mitigates business risks, develops contingency plans.",
        icon: <AlertOctagon className="h-6 w-6 text-blue-600" />
      }
    ],
    tactical: [
      {
        title: "Human Resource Manager",
        description: "Oversees recruitment, training, and employee relations.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Operations Manager",
        description: "Coordinates daily operations and implements strategic initiatives.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Procurement Manager",
        description: "Manages supplier relationships, negotiates contracts, and oversees purchasing processes.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Factory Manager",
        description: "Directs manufacturing operations, maintains production standards, and optimizes processes.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Finance Manager",
        description: "Manages financial planning, budgeting, and accounting operations.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Sales & Export Manager",
        description: "Develops sales strategies, manages client relationships, and oversees export operations.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Logistics Manager",
        description: "Coordinates supply chain operations, transportation, and distribution networks.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Inventory Manager",
        description: "Maintains optimal stock levels, manages warehouse operations, and tracks inventory.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Marketing Manager",
        description: "Develops marketing strategies, manages brand identity, and oversees promotional activities.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "IT Manager",
        description: "Manages technology infrastructure, provides technical support, and implements IT solutions.",
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: "Product Development Manager",
        description: "Leads product innovation, manages development cycles, and ensures market alignment.",
        icon: <Users className="h-6 w-6 text-green-600" />
      }
    ],
    operational: [
      {
        title: "Warehouse Supervisor",
        description: "Manages daily warehouse operations and inventory storage.",
        icon: <Warehouse className="h-6 w-6 text-purple-600" />
      },
      {
        title: "Association Manager",
        description: "Maintains relationships with partners and associations.",
        icon: <Users className="h-6 w-6 text-purple-600" />
      },
      {
        title: "Farm Manager",
        description: "Oversees agricultural operations and farm workers.",
        icon: <Tractor className="h-6 w-6 text-purple-600" />
      }
    ]
  };

  const renderRoleCard = (role) => (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedRole(role.title)}
        >
          <div className="flex items-center gap-3 mb-2">
            {role.icon}
            <h3 className="font-semibold">{role.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{role.description}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to {role.title}</DialogTitle>
        </DialogHeader>
        <AuthenticationForm 
          onAuthenticate={handleAuthenticate}
          title={`Enter ${role.title} Credentials`}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="strategic">
        <AccordionTrigger className="text-lg font-semibold">
          Strategic/Executive Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.strategic.map((role, index) => renderRoleCard(role))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tactical">
        <AccordionTrigger className="text-lg font-semibold">
          Tactical/Departmental Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.tactical.map((role, index) => renderRoleCard(role))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="operational">
        <AccordionTrigger className="text-lg font-semibold">
          Operational/Field Management
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.operational.map((role, index) => renderRoleCard(role))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SystemAccounts;
