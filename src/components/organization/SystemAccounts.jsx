
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Shield, AlertOctagon, Users, Warehouse, Tractor, UserPlus, UserCog } from 'lucide-react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';

const SystemAccounts = () => {
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (roleTitle) => {
    console.log("Selected role:", roleTitle);
    toast({
      title: "Role Selected",
      description: `You are now viewing the ${roleTitle} dashboard`,
    });
    
    // Pass the selected role to the parent component
    if (typeof window !== 'undefined') {
      // This only works on the client side
      const event = new CustomEvent('roleSelected', { detail: roleTitle });
      window.dispatchEvent(event);
    }
  };

  const roles = {
    strategic: [
      {
        title: "Board of Directors",
        description: "Oversees corporate governance and strategic direction of the organization.",
        icon: <UserPlus className="h-6 w-6 text-primary" />
      },
      {
        title: "Chief Executive Officer (CEO)",
        description: "H.E Maj. Gen. Geoffrey Muheesi leads the organization, setting strategic direction and overseeing all operations.",
        icon: <User className="h-6 w-6 text-primary" />
      },
      {
        title: "CEO's Personal Assistant",
        description: "PA. Nelson Namanya - Manages CEO's schedule, communications, and administrative tasks.",
        icon: <UserCog className="h-6 w-6 text-primary" />
      },
      {
        title: "System Administrator (SysAdmin)",
        description: "Manages and maintains IT infrastructure, system security, and user access.",
        icon: <Settings className="h-6 w-6 text-primary" />
      },
      {
        title: "Compliance & Quality Control Officer",
        description: "Ensures adherence to regulatory requirements and maintains quality standards.",
        icon: <Shield className="h-6 w-6 text-primary" />
      },
      {
        title: "Risk Manager",
        description: "Manages organizational risks, compliance monitoring, and business continuity planning.",
        icon: <AlertOctagon className="h-6 w-6 text-primary" />
      }
    ],
    tactical: [
      {
        title: "Human Resource Manager",
        description: "Oversees recruitment, training, and employee relations.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Operations Manager",
        description: "Coordinates daily operations and implements strategic initiatives.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Procurement Manager",
        description: "Manages supplier relationships, negotiates contracts, and oversees purchasing processes.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Factory Manager",
        description: "Directs manufacturing operations, maintains production standards, and optimizes processes.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Finance Manager",
        description: "Manages financial planning, budgeting, and accounting operations.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Sales & Export Manager",
        description: "Develops sales strategies, manages client relationships, and oversees export operations.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Logistics Manager",
        description: "Coordinates supply chain operations, transportation, and distribution networks.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Inventory Manager",
        description: "Maintains optimal stock levels, manages warehouse operations, and tracks inventory.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Marketing Manager",
        description: "Develops marketing strategies, manages brand identity, and oversees promotional activities.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "IT Manager",
        description: "Manages technology infrastructure, provides technical support, and implements IT solutions.",
        icon: <Users className="h-6 w-6 text-secondary" />
      },
      {
        title: "Product Development Manager",
        description: "Leads product innovation, manages development cycles, and ensures market alignment.",
        icon: <Users className="h-6 w-6 text-secondary" />
      }
    ],
    operational: [
      {
        title: "Warehouse Supervisor",
        description: "Manages daily warehouse operations and inventory storage.",
        icon: <Warehouse className="h-6 w-6 text-accent" />
      },
      {
        title: "Association Manager",
        description: "Maintains relationships with partners and associations.",
        icon: <Users className="h-6 w-6 text-accent" />
      },
      {
        title: "Farm Manager",
        description: "Oversees agricultural operations and farm workers.",
        icon: <Tractor className="h-6 w-6 text-accent" />
      }
    ]
  };

  const renderRoleCard = (role) => (
    <div 
      key={role.title}
      className="p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border"
      onClick={() => handleRoleSelect(role.title)}
    >
      <div className="flex items-center gap-3 mb-2">
        {role.icon}
        <h3 className="font-semibold">{role.title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{role.description}</p>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Strategic/Executive Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.strategic.map((role) => renderRoleCard(role))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tactical/Departmental Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.tactical.map((role) => renderRoleCard(role))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Operational/Field Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.operational.map((role) => renderRoleCard(role))}
        </div>
      </div>
    </div>
  );
};

export default SystemAccounts;
