import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  Shield, 
  Settings, 
  FileText, 
  BarChart, 
  CheckSquare,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';
import RoleDescriptions from './RoleDescriptions';
import OperationalProceduresManager from './operational-procedures/OperationalProceduresManager';

const OrganizationalChart = () => {
  const [showOperationalProcedures, setShowOperationalProcedures] = useState(false);

  // Define organizational structure with hierarchy visualization
  const organizationalStructure = {
    strategic: [
      {
        title: "Chief Executive Officer (CEO)",
        name: "H.E Maj. Gen. Geoffrey Muheesi",
        responsibilities: [
          "Overall company management and strategic decision-making",
          "Review and approve high-level reports and financial statements",
          "Set company goals and objectives",
          "Represent the company in major business dealings and partnerships"
        ],
        icon: Building,
        color: "bg-blue-500"
      },
      {
        title: "Board of Directors",
        responsibilities: [
          "Governance and strategic oversight",
          "Policy development and approval",
          "Risk management oversight",
          "Executive performance evaluation"
        ],
        icon: Shield,
        color: "bg-purple-500"
      },
      {
        title: "CEO's Personal Assistant",
        responsibilities: [
          "Executive support and coordination",
          "Meeting and schedule management",
          "Communication liaison",
          "Project coordination support"
        ],
        icon: Users,
        color: "bg-indigo-500"
      },
      {
        title: "System Administrator (SysAdmin)",
        responsibilities: [
          "Overall system management and oversight",
          "Configure system settings and user permissions",
          "Ensure data backups and security protocols",
          "Maintain system infrastructure and updates"
        ],
        icon: Settings,
        color: "bg-gray-500"
      }
    ],
    tactical: [
      {
        title: "Compliance & Quality Control Officer",
        responsibilities: [
          "Ensure regulatory compliance",
          "Quality assurance oversight",
          "Audit coordination",
          "Standards implementation"
        ],
        icon: CheckSquare,
        color: "bg-green-500"
      },
      {
        title: "Risk Manager",
        responsibilities: [
          "Risk assessment and mitigation",
          "Business continuity planning",
          "Insurance coordination",
          "Crisis management"
        ],
        icon: AlertTriangle,
        color: "bg-red-500"
      },
      {
        title: "Human Resource Manager",
        responsibilities: [
          "Recruitment and staffing",
          "Training and development",
          "Employee relations",
          "Performance management"
        ],
        icon: Users,
        color: "bg-pink-500"
      },
      {
        title: "Operations Manager",
        responsibilities: [
          "Daily operations coordination",
          "Process optimization",
          "Resource allocation",
          "Performance monitoring"
        ],
        icon: Settings,
        color: "bg-blue-600"
      },
      {
        title: "Procurement Manager",
        responsibilities: [
          "Supplier relationship management",
          "Contract negotiation",
          "Purchase order processing",
          "Vendor evaluation"
        ],
        icon: FileText,
        color: "bg-orange-500"
      },
      {
        title: "Factory Manager",
        responsibilities: [
          "Production oversight",
          "Manufacturing operations",
          "Equipment maintenance",
          "Safety compliance"
        ],
        icon: Building,
        color: "bg-yellow-600"
      },
      {
        title: "Finance Manager",
        responsibilities: [
          "Financial planning and analysis",
          "Budget management",
          "Accounting oversight",
          "Financial reporting"
        ],
        icon: BarChart,
        color: "bg-green-600"
      },
      {
        title: "Sales & Export Manager",
        responsibilities: [
          "Sales strategy development",
          "Client relationship management",
          "Export operations",
          "Market development"
        ],
        icon: Target,
        color: "bg-blue-700"
      },
      {
        title: "Logistics Manager",
        responsibilities: [
          "Supply chain coordination",
          "Transportation management",
          "Distribution oversight",
          "Inventory optimization"
        ],
        icon: Settings,
        color: "bg-indigo-600"
      },
      {
        title: "Inventory Manager",
        responsibilities: [
          "Stock level management",
          "Warehouse operations",
          "Inventory tracking",
          "Order fulfillment"
        ],
        icon: FileText,
        color: "bg-purple-600"
      },
      {
        title: "Marketing Manager",
        responsibilities: [
          "Brand management",
          "Marketing campaigns",
          "Market research",
          "Customer engagement"
        ],
        icon: Target,
        color: "bg-pink-600"
      },
      {
        title: "IT Manager",
        responsibilities: [
          "Technology infrastructure",
          "System administration",
          "Technical support",
          "Digital transformation"
        ],
        icon: Settings,
        color: "bg-gray-600"
      },
      {
        title: "Product Development Manager",
        responsibilities: [
          "Product innovation",
          "Development lifecycle",
          "Quality testing",
          "Market alignment"
        ],
        icon: Target,
        color: "bg-teal-600"
      }
    ],
    operational: [
      {
        title: "Warehouse Supervisor",
        responsibilities: [
          "Daily warehouse operations",
          "Inventory management",
          "Staff supervision",
          "Safety protocols"
        ],
        icon: Building,
        color: "bg-yellow-500"
      },
      {
        title: "Association Manager",
        responsibilities: [
          "Partner relationships",
          "Association coordination",
          "Community engagement",
          "Collaborative projects"
        ],
        icon: Users,
        color: "bg-green-500"
      },
      {
        title: "Farm Manager",
        responsibilities: [
          "Agricultural operations",
          "Crop management",
          "Farm workers supervision",
          "Production optimization"
        ],
        icon: Building,
        color: "bg-green-700"
      }
    ]
  };

  const handleRoleClick = (role) => {
    const event = new CustomEvent('roleSelected', { detail: role });
    window.dispatchEvent(event);
  };

  const organizationalFeatures = [
    {
      title: "Role Definitions",
      description: "Clear role descriptions and responsibilities",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Reporting Structure",
      description: "Hierarchical reporting relationships",
      icon: BarChart,
      color: "text-green-500"
    },
    {
      title: "Operational Procedures",
      description: "Standardized operational procedures and workflows",
      icon: FileText,
      color: "text-purple-500",
      onClick: () => setShowOperationalProcedures(true)
    },
    {
      title: "Governance Framework",
      description: "Corporate governance and compliance structure",
      icon: Shield,
      color: "text-red-500"
    }
  ];

  if (showOperationalProcedures) {
    return (
      <OperationalProceduresManager 
        onBack={() => setShowOperationalProcedures(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          GKK Integrated Management System
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive organizational structure covering strategic, tactical, and operational management 
          across Grand Berna Dairies, KAJON Coffee, and Kyalima Farmers Limited.
        </p>
      </div>

      {/* Organizational Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {organizationalFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer hover:shadow-lg transition-shadow ${feature.onClick ? 'hover:bg-gray-50' : ''}`}
            onClick={feature.onClick}
          >
            <CardContent className="p-4 text-center">
              <feature.icon className={`h-8 w-8 mx-auto mb-2 ${feature.color}`} />
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizational Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organizational Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="strategic">
                <AccordionTrigger className="text-lg font-semibold">
                  Strategic/Executive Management
                  <Badge variant="secondary" className="ml-2">
                    {organizationalStructure.strategic.length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {organizationalStructure.strategic.map((role, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <button
                          onClick={() => handleRoleClick(role.title)}
                          className="text-left w-full hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <role.icon className={`h-4 w-4 text-white p-1 rounded ${role.color}`} />
                            <span className="font-medium text-blue-700">{role.title}</span>
                          </div>
                          {role.name && (
                            <p className="text-sm font-semibold text-gray-800 ml-6">{role.name}</p>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tactical">
                <AccordionTrigger className="text-lg font-semibold">
                  Tactical/Departmental Management
                  <Badge variant="secondary" className="ml-2">
                    {organizationalStructure.tactical.length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-2">
                    {organizationalStructure.tactical.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleClick(role.title)}
                        className="flex items-center text-green-700 hover:underline cursor-pointer text-left p-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <role.icon className={`h-4 w-4 text-white p-1 rounded mr-2 ${role.color}`} />
                        {role.title}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="operational">
                <AccordionTrigger className="text-lg font-semibold">
                  Operational/Field Management
                  <Badge variant="secondary" className="ml-2">
                    {organizationalStructure.operational.length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {organizationalStructure.operational.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleClick(role.title)}
                        className="flex items-center text-purple-700 hover:underline cursor-pointer text-left p-2 hover:bg-gray-50 rounded transition-colors w-full"
                      >
                        <role.icon className={`h-4 w-4 text-white p-1 rounded mr-2 ${role.color}`} />
                        {role.title}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="procedures">
                <AccordionTrigger className="text-lg font-semibold">
                  Operational Procedures
                  <Badge variant="secondary" className="ml-2">
                    12
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setShowOperationalProcedures(true)}
                      className="flex items-center text-blue-700 hover:underline cursor-pointer text-left p-2 hover:bg-gray-50 rounded transition-colors w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Operational Procedures
                    </button>
                    <li className="flex items-center text-green-700 hover:underline cursor-pointer">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Quality Control Standards
                    </li>
                    <li className="flex items-center text-yellow-700 hover:underline cursor-pointer">
                      <Clock className="h-4 w-4 mr-2" />
                      Safety Protocols
                    </li>
                    <li className="flex items-center text-purple-700 hover:underline cursor-pointer">
                      <Target className="h-4 w-4 mr-2" />
                      Performance Metrics
                    </li>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoleDescriptions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationalChart;
