
import React, { useState } from 'react';
import { User, Settings, Shield, AlertOctagon, Users, Warehouse, Tractor, UserPlus, UserCog, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const OrganizationalChart = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {/* Strategic/Executive Management */}
        <AccordionItem value="executive">
          <AccordionTrigger className="py-4 text-lg font-semibold">
            <div className="flex items-center text-blue-800">
              <User className="mr-2 h-5 w-5" /> 
              <span>Strategic/Executive Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">Board of Directors</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <User className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">CEO - H.E Maj. Gen. Geoffrey Muheesi</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <UserCog className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">CEO's Personal Assistant - PA. Nelson Namanya</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <Settings className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">System Administrator</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <Shield className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">Compliance & Quality Control Officer</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <AlertOctagon className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                <span className="text-sm">Risk Manager</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tactical/Departmental Management */}
        <AccordionItem value="departmental">
          <AccordionTrigger className="py-4 text-lg font-semibold">
            <div className="flex items-center text-green-800">
              <Users className="mr-2 h-5 w-5" /> 
              <span>Tactical/Departmental Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {[
                'Human Resource Manager',
                'Operations Manager',
                'Procurement Manager',
                'Factory Manager',
                'Finance Manager',
                'Sales & Export Manager',
                'Logistics Manager',
                'Inventory Manager',
                'Marketing Manager',
                'IT Manager',
                'Product Development Manager'
              ].map((role, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow">
                  <Users className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{role}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Operational/Field Management */}
        <AccordionItem value="operational">
          <AccordionTrigger className="py-4 text-lg font-semibold">
            <div className="flex items-center text-purple-800">
              <Users className="mr-2 h-5 w-5" /> 
              <span>Operational/Field Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <Warehouse className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" />
                <span className="text-sm">Warehouse Supervisor</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <Users className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" />
                <span className="text-sm">Association Manager</span>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg shadow">
                <Tractor className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" />
                <span className="text-sm">Farm Manager</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OrganizationalChart;
