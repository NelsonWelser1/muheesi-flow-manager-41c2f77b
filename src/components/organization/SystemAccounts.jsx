
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
        icon: <UserPlus className="h-6 w-6 text-blue-600" />
      },
      {
        title: "Chief Executive Officer (CEO)",
        description: "H.E Maj. Gen. Geoffrey Muheesi leads the organization, setting strategic direction and overseeing all operations.",
        icon: <User className="h-6 w-6 text-blue-600" />
      },
      {
        title: "CEO's Personal Assistant",
        description: "PA. Nelson Namanya - Manages CEO's schedule, communications, and administrative tasks.",
        icon: <UserCog className="h-6 w-6 text-blue-600" />
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
        description: "Manages organizational risks, compliance monitoring, and business continuity planning.",
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
    <div 
      key={role.title}
      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleRoleSelect(role.title)}
    >
      <div className="flex items-center gap-3 mb-2">
        {role.icon}
        <h3 className="font-semibold">{role.title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{role.description}</p>
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
