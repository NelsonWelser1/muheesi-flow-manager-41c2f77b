import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SystemAdministrator from '../components/SystemAdministrator';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const userRoles = [
  {
    title: "System Administrator (SysAdmin)",
    component: <SystemAdministrator />,
    isAdmin: true,
    primaryActions: [
      "System Health",
      "System Settings",
      "Database Operations",
      "Data Backups",
      "Security Protocols",
      "Technical Issues",
      "Software Updates",
      "Audit Logs",
      "System Alerts",
      "Manage Accounts"
    ]
  },
  {
    title: "Chief Executive Officer (CEO) H.E. Rtd. Maj. Gen. Muheesi Geoffrey Baraba",
    responsibilities: [
      "Overall strategic direction",
      "Company performance oversight",
      "Major business decisions",
      "Executive leadership"
    ],
    primaryActions: [
      "View Company Performance",
      "Approve Major Decisions",
      "Review Reports",
      "Manage Strategic Plans"
    ]
  },
  {
    title: "Operations Manager",
    responsibilities: [
      "Daily operations oversight",
      "Resource allocation",
      "Performance monitoring",
      "Process optimization"
    ],
    primaryActions: [
      "Manage Daily Operations",
      "Review Resource Allocation",
      "Monitor Performance",
      "Optimize Processes"
    ]
  },
  {
    title: "Farm Supervisor",
    responsibilities: [
      "Farm operations management",
      "Crop monitoring",
      "Worker supervision",
      "Production reporting"
    ],
    primaryActions: [
      "Manage Farm Operations",
      "Monitor Crop Health",
      "Supervise Workers",
      "Report Production"
    ]
  },
  {
    title: "Warehouse Manager",
    responsibilities: [
      "Inventory oversight",
      "Storage management",
      "Stock control",
      "Warehouse operations"
    ],
    primaryActions: [
      "Oversee Inventory",
      "Manage Storage",
      "Control Stock Levels",
      "Optimize Warehouse Operations"
    ]
  },
  {
    title: "Coffee Store Manager",
    responsibilities: [
      "Coffee stock management",
      "Quality maintenance",
      "Storage conditions",
      "Inventory tracking"
    ],
    primaryActions: [
      "Manage Coffee Stock",
      "Ensure Quality",
      "Maintain Storage Conditions",
      "Track Inventory"
    ]
  },
  {
    title: "Logistics Manager",
    responsibilities: [
      "Transportation coordination",
      "Supply chain management",
      "Delivery scheduling",
      "Route optimization"
    ],
    primaryActions: [
      "Coordinate Transportation",
      "Manage Supply Chain",
      "Schedule Deliveries",
      "Optimize Routes"
    ]
  },
  {
    title: "Inventory Manager",
    responsibilities: [
      "Stock level monitoring",
      "Inventory control",
      "Stock reporting",
      "Supply management"
    ],
    primaryActions: [
      "Monitor Stock Levels",
      "Control Inventory",
      "Report Stock Status",
      "Manage Supplies"
    ]
  },
  {
    title: "Finance Manager",
    responsibilities: [
      "Financial oversight",
      "Budget management",
      "Cost control",
      "Financial reporting"
    ],
    primaryActions: [
      "Oversee Finances",
      "Manage Budgets",
      "Control Costs",
      "Report Financials"
    ]
  },
  {
    title: "Sales and Marketing Manager",
    responsibilities: [
      "Sales strategy",
      "Market development",
      "Client relations",
      "Revenue growth"
    ],
    primaryActions: [
      "Develop Sales Strategy",
      "Expand Market Reach",
      "Manage Client Relations",
      "Drive Revenue Growth"
    ]
  },
  {
    title: "Coffee Quality Analyst",
    responsibilities: [
      "Quality assessment",
      "Sample analysis",
      "Standards compliance",
      "Quality reporting"
    ],
    primaryActions: [
      "Assess Quality",
      "Analyze Samples",
      "Ensure Compliance",
      "Report Quality Findings"
    ]
  },
  {
    title: "General Data Clerk",
    responsibilities: [
      "Data entry",
      "Record keeping",
      "Document management",
      "Report generation"
    ],
    primaryActions: [
      "Enter Data",
      "Maintain Records",
      "Manage Documents",
      "Generate Reports"
    ]
  }
];

const ManageCompanies = () => {
  const [selectedRole, setSelectedRole] = useState(userRoles[0]);
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar with primary actions */}
        <div className="col-span-3 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Select Account</h2>
          <ScrollArea className="h-[600px]">
            {userRoles.map((role, index) => (
              <Button
                key={index}
                variant={selectedRole === role ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setSelectedRole(role)}
              >
                {role.title}
              </Button>
            ))}
          </ScrollArea>
        </div>

        {/* Main content area */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Header with role info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{selectedRole.title}</h2>
              <p className="text-gray-600 mt-2">
                {selectedRole.isAdmin ? "System Administrator Account" : "Standard User Account"}
              </p>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {selectedRole.isAdmin ? (
                  selectedRole.component
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Responsibilities:</h3>
                    <ul className="list-disc pl-5">
                      {selectedRole.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-gray-700">{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions">
                <div className="grid grid-cols-2 gap-4">
                  {(selectedRole.primaryActions || []).map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center text-center"
                      onClick={() => setSelectedAction(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="permissions">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Access Control</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">Modify Permissions</Button>
                    <Button variant="outline">View Access Logs</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
