import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Award,
  ArrowLeft,
  FileText
} from 'lucide-react';
import OperationalProcedures from './operational-procedures/OperationalProcedures';

const OrganizationalChart = () => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [showOperationalProcedures, setShowOperationalProcedures] = useState(false);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // If showing operational procedures, render that component
  if (showOperationalProcedures) {
    return (
      <div>
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowOperationalProcedures(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Organizational Chart
          </Button>
        </div>
        <OperationalProcedures />
      </div>
    );
  }

  const organizationalData = {
    ceo: {
      name: "Chief Executive Officer",
      position: "CEO",
      holder: "Grace Muheesi",
      departments: {
        finance: {
          name: "Finance Department",
          head: "Finance Manager",
          teams: ["Accounting", "Budget Planning", "Financial Analysis"]
        },
        operations: {
          name: "Operations Department", 
          head: "Operations Manager",
          teams: ["Production", "Quality Control", "Logistics"]
        },
        hr: {
          name: "Human Resources",
          head: "HR Manager", 
          teams: ["Recruitment", "Training", "Employee Relations"]
        },
        it: {
          name: "Information Technology",
          head: "IT Manager",
          teams: ["System Administration", "Software Development", "Technical Support"]
        }
      }
    },
    companies: {
      grandBerna: {
        name: "Grand Berna Dairies",
        manager: "Dairy Operations Manager",
        departments: ["Production", "Quality Control", "Distribution", "Sales"]
      },
      kajon: {
        name: "KAJON Coffee Limited", 
        manager: "Coffee Operations Manager",
        departments: ["Sourcing", "Processing", "Export", "Marketing"]
      },
      kyalima: {
        name: "Kyalima Farmers Limited",
        manager: "Farm Operations Manager", 
        departments: ["Crop Production", "Livestock", "Equipment", "Market Relations"]
      }
    }
  };

  const quickActions = [
    { 
      name: "View All Accounts", 
      icon: Users, 
      description: "See all system user accounts",
      onClick: () => console.log("View accounts")
    },
    { 
      name: "Role Permissions", 
      icon: UserCheck, 
      description: "Manage role-based permissions",
      onClick: () => console.log("Manage permissions")
    },
    { 
      name: "Performance Reviews", 
      icon: Award, 
      description: "Access performance evaluation system",
      onClick: () => console.log("Performance reviews")
    },
    { 
      name: "Operational Procedures", 
      icon: FileText, 
      description: "Manage operational procedures and protocols",
      onClick: () => setShowOperationalProcedures(true)
    }
  ];

  const DepartmentNode = ({ department, isExpanded, onToggle, level = 0 }) => (
    <div className={`ml-${level * 4} mb-2`}>
      <div 
        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">{department.name}</span>
          <Badge variant="outline" className="text-xs">{department.head}</Badge>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      
      {isExpanded && department.teams && (
        <div className="ml-6 mt-2 space-y-1">
          {department.teams.map((team, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <Users className="h-3 w-3 text-gray-600" />
              <span className="text-sm text-gray-700">{team}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CompanyNode = ({ company, companyKey }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-green-600" />
          <span>{company.name}</span>
          <Badge className="bg-green-100 text-green-800">{company.manager}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {company.departments.map((dept, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <Users className="h-3 w-3 text-green-600" />
              <span className="text-sm text-green-700">{dept}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">GKK Group Organizational Structure</h2>
        <p className="text-gray-600">Comprehensive overview of our organizational hierarchy and operational structure</p>
      </div>

      {/* CEO Level */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Award className="h-6 w-6 text-purple-600" />
            <div className="text-center">
              <div className="text-lg font-bold text-purple-900">{organizationalData.ceo.holder}</div>
              <div className="text-sm text-purple-700">{organizationalData.ceo.name}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Corporate Departments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Corporate Departments</h3>
            <div className="space-y-2">
              {Object.entries(organizationalData.ceo.departments).map(([key, department]) => (
                <DepartmentNode
                  key={key}
                  department={department}
                  isExpanded={expandedNodes[key]}
                  onToggle={() => toggleNode(key)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Level */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Operating Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(organizationalData.companies).map(([key, company]) => (
            <CompanyNode key={key} company={company} companyKey={key} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={action.onClick}>
                <div className="flex items-center space-x-3">
                  <action.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{action.name}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Internal Messaging System</span>
              </li>
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Company-wide Announcements</span>
              </li>
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Department Meetings Schedule</span>
              </li>
              <li 
                className="flex items-center text-blue-700 hover:underline cursor-pointer"
                onClick={() => setShowOperationalProcedures(true)}
              >
                <span>Operational Procedures</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Employee Handbook</span>
              </li>
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Policy Documents</span>
              </li>
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Training Materials</span>
              </li>
              <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                <span>Emergency Contacts</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationalChart;
