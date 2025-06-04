
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const RiskPolicyManagement = () => {
  const policies = [
    {
      id: "POL-001",
      title: "Risk Management Framework",
      version: "v2.1",
      status: "Active",
      lastUpdated: "2024-04-15",
      nextReview: "2024-10-15",
      owner: "Risk Manager",
      category: "Framework"
    },
    {
      id: "POL-002",
      title: "Information Security Policy",
      version: "v1.8",
      status: "Under Review",
      lastUpdated: "2024-03-20",
      nextReview: "2024-06-20",
      owner: "IT Manager",
      category: "Security"
    },
    {
      id: "POL-003",
      title: "Business Continuity Policy",
      version: "v3.0",
      status: "Active",
      lastUpdated: "2024-05-01",
      nextReview: "2024-11-01",
      owner: "Operations Manager",
      category: "Continuity"
    },
    {
      id: "POL-004",
      title: "Supplier Risk Assessment",
      version: "v1.5",
      status: "Needs Update",
      lastUpdated: "2024-01-10",
      nextReview: "2024-07-10",
      owner: "Procurement Manager",
      category: "Procurement"
    },
    {
      id: "POL-005",
      title: "Financial Risk Controls",
      version: "v2.3",
      status: "Active",
      lastUpdated: "2024-04-25",
      nextReview: "2024-10-25",
      owner: "Finance Manager",
      category: "Financial"
    },
    {
      id: "POL-006",
      title: "Environmental Compliance",
      version: "v1.2",
      status: "Draft",
      lastUpdated: "2024-05-15",
      nextReview: "2024-08-15",
      owner: "Compliance Officer",
      category: "Environmental"
    }
  ];

  const riskFrameworks = [
    {
      framework: "ISO 31000:2018",
      implementation: "Implemented",
      compliance: 94,
      lastAssessment: "2024-03-15"
    },
    {
      framework: "COSO ERM Framework",
      implementation: "Partially Implemented",
      compliance: 78,
      lastAssessment: "2024-04-10"
    },
    {
      framework: "ISO 27001 (Information Security)",
      implementation: "In Progress",
      compliance: 65,
      lastAssessment: "2024-05-20"
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 text-white';
      case 'implemented': return 'bg-green-500 text-white';
      case 'under review': return 'bg-yellow-500 text-white';
      case 'partially implemented': return 'bg-yellow-500 text-white';
      case 'needs update': return 'bg-red-500 text-white';
      case 'draft': return 'bg-blue-500 text-white';
      case 'in progress': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under review':
      case 'partially implemented':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'needs update':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Risk Policy Management</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{policy.title}</h4>
                      <p className="text-sm text-muted-foreground">{policy.id} • {policy.version}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(policy.status)}
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{policy.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Owner</p>
                      <p className="font-medium">{policy.owner}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{policy.lastUpdated}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Review</p>
                      <p className="font-medium">{policy.nextReview}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Policy
                    </Button>
                    <Button size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Frameworks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskFrameworks.map((framework, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-sm">{framework.framework}</h4>
                  <Badge className={getStatusColor(framework.implementation)}>
                    {framework.implementation}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance</span>
                    <span className="font-medium">{framework.compliance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${framework.compliance}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Last Assessment: {framework.lastAssessment}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              Policy Review
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Version Control
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Approve Policy
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Policy Violations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskPolicyManagement;
