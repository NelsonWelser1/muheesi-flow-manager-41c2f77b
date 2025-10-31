
import React, { useState } from 'react';
import { User, Settings, Shield, AlertOctagon, Users, Warehouse, Tractor, UserPlus, UserCog, ChevronRight, BarChart3, Building, UserRound } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const OrganizationalChart = () => {
  const [expanded, setExpanded] = useState("executive");
  
  // Define organizational structure with hierarchy visualization
  const orgLevels = [
    {
      id: "executive",
      title: "Strategic/Executive Management",
      description: "Top-level decision makers responsible for company vision and strategy",
      color: "blue",
      icon: <UserPlus className="h-5 w-5" />,
      roles: [
        {
          title: "Board of Directors",
          icon: <UserPlus className="h-5 w-5" />,
          description: "Governance and oversight of company activities",
          staff: "5 members",
          responsibilities: ["Strategic Planning", "Corporate Governance", "Risk Oversight"]
        },
        {
          title: "CEO - H.E Maj. Gen. Geoffrey Muheesi",
          icon: <User className="h-5 w-5" />,
          description: "Chief executive responsible for overall company direction",
          staff: "1",
          responsibilities: ["Strategic Leadership", "Executive Decision Making", "Corporate Vision"]
        },
        {
          title: "CEO's Personal Assistant - PA. Nelson Namanya",
          icon: <UserCog className="h-5 w-5" />,
          description: "Supports CEO with administrative and operational tasks",
          staff: "1",
          responsibilities: ["Schedule Management", "Communication", "Administrative Support"]
        },
        {
          title: "System Administrator",
          icon: <Settings className="h-5 w-5" />,
          description: "Manages IT infrastructure and system security",
          staff: "2",
          responsibilities: ["IT Infrastructure", "Security Protocols", "User Access Management"]
        },
        {
          title: "Compliance & Quality Control Officer",
          icon: <Shield className="h-5 w-5" />,
          description: "Ensures adherence to regulations and quality standards",
          staff: "3",
          responsibilities: ["Regulatory Compliance", "Quality Standards", "Audit Management"]
        },
        {
          title: "Risk Manager",
          icon: <AlertOctagon className="h-5 w-5" />,
          description: "Identifies and mitigates business risks",
          staff: "2",
          responsibilities: ["Risk Assessment", "Mitigation Strategies", "Contingency Planning"]
        }
      ]
    },
    {
      id: "departmental",
      title: "Tactical/Departmental Management",
      description: "Mid-level managers overseeing specific business functions",
      color: "green",
      icon: <Users className="h-5 w-5" />,
      roles: [
        {
          title: "Human Resource Manager",
          icon: <Users className="h-5 w-5" />,
          description: "Manages recruitment and employee relations",
          staff: "5",
          responsibilities: ["Recruitment", "Employee Development", "Policy Implementation"]
        },
        {
          title: "Operations Manager",
          icon: <BarChart3 className="h-5 w-5" />,
          description: "Oversees day-to-day business operations",
          staff: "7",
          responsibilities: ["Process Optimization", "Operational Efficiency", "Resource Allocation"]
        },
        {
          title: "Procurement Manager",
          icon: <Building className="h-5 w-5" />,
          description: "Manages supplier relationships and purchasing",
          staff: "4",
          responsibilities: ["Vendor Management", "Supply Chain", "Cost Optimization"]
        },
        {
          title: "Factory Manager",
          icon: <Warehouse className="h-5 w-5" />,
          description: "Directs manufacturing operations",
          staff: "12",
          responsibilities: ["Production Planning", "Quality Control", "Process Improvement"]
        },
        {
          title: "Finance Manager",
          icon: <UserRound className="h-5 w-5" />,
          description: "Manages financial planning and accounting",
          staff: "6",
          responsibilities: ["Financial Reporting", "Budget Management", "Cash Flow"]
        }
      ]
    },
    {
      id: "operational",
      title: "Operational/Field Management",
      description: "Front-line managers handling direct production and service delivery",
      color: "purple",
      icon: <Tractor className="h-5 w-5" />,
      roles: [
        {
          title: "Warehouse Supervisor",
          icon: <Warehouse className="h-5 w-5" />,
          description: "Manages inventory storage and warehouse operations",
          staff: "8",
          responsibilities: ["Inventory Management", "Logistics", "Warehouse Safety"]
        },
        {
          title: "Association Manager",
          icon: <Users className="h-5 w-5" />,
          description: "Maintains relationships with partners and associations",
          staff: "3",
          responsibilities: ["Partner Relations", "Community Outreach", "Association Coordination"]
        },
        {
          title: "Farm Manager",
          icon: <Tractor className="h-5 w-5" />,
          description: "Oversees agricultural operations and farm workers",
          staff: "15",
          responsibilities: ["Crop Management", "Livestock Oversight", "Yield Optimization"]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Organizational Structure</h2>
        <Badge variant="outline" className="bg-slate-100">Total Staff: 74</Badge>
      </div>
      
      {/* Visual Org Chart Hierarchy */}
      <div className="relative">
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200"></div>
        <div className="space-y-5 pl-12">
          {orgLevels.map((level) => (
            <Card key={level.id} className={`border-l-4 border-${level.color}-500 shadow-sm hover:shadow transition-shadow`}>
              <div 
                className={`p-4 cursor-pointer flex justify-between items-center bg-${level.color}-50`}
                onClick={() => setExpanded(expanded === level.id ? null : level.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-${level.color}-100 text-${level.color}-600`}>
                    {level.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{level.title}</h3>
                    <p className="text-sm text-gray-500">{level.description}</p>
                  </div>
                </div>
                <ChevronRight 
                  className={`h-5 w-5 text-${level.color}-500 transform transition-transform ${expanded === level.id ? 'rotate-90' : ''}`} 
                />
              </div>
              
              {expanded === level.id && (
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {level.roles.map((role) => (
                      <TooltipProvider key={role.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`bg-${level.color}-50 border border-${level.color}-100 rounded-lg p-4 hover:shadow-md transition-shadow`}>
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full bg-${level.color}-100 text-${level.color}-600`}>
                                  {role.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{role.title}</h4>
                                  <div className="flex items-center mt-1">
                                    <Badge variant="outline" className="text-xs">Staff: {role.staff}</Badge>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{role.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.responsibilities.map((resp, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-white">{resp}</Badge>
                                ))}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <div className="text-sm">
                              <strong>Key Responsibilities:</strong>
                              <ul className="list-disc pl-4 mt-1">
                                {role.responsibilities.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      {/* Business Management Information */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Business Management Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 bg-primary/10">
              <h4 className="font-medium mb-2">Company Policies</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center text-primary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Operational Procedures
                </li>
                <li className="flex items-center text-primary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Staff Handbook
                </li>
                <li className="flex items-center text-primary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Quality Standards Manual
                </li>
              </ul>
            </div>
            <div className="border rounded-md p-4 bg-secondary/10">
              <h4 className="font-medium mb-2">Planning Resources</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center text-secondary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Strategic Plan 2024-2025
                </li>
                <li className="flex items-center text-secondary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Budget Templates
                </li>
                <li className="flex items-center text-secondary hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Risk Assessment Tools
                </li>
              </ul>
            </div>
            <div className="border rounded-md p-4 bg-accent/10">
              <h4 className="font-medium mb-2">Communication Tools</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center text-accent hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Company Directory
                </li>
                <li className="flex items-center text-accent hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Reporting Templates
                </li>
                <li className="flex items-center text-accent hover:underline cursor-pointer">
                  <ChevronRight className="h-4 w-4 mr-1" /> Meeting Scheduler
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalChart;
