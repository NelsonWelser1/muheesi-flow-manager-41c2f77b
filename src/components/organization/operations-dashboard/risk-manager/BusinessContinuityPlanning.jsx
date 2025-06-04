
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const BusinessContinuityPlanning = () => {
  const continuityPlans = [
    {
      plan: "IT Disaster Recovery",
      status: "Active",
      lastTested: "2024-04-15",
      nextTest: "2024-07-15",
      coverage: 95,
      rto: "4 hours",
      rpo: "1 hour"
    },
    {
      plan: "Supply Chain Continuity",
      status: "Under Review",
      lastTested: "2024-03-20",
      nextTest: "2024-06-20",
      coverage: 88,
      rto: "24 hours",
      rpo: "8 hours"
    },
    {
      plan: "Emergency Response",
      status: "Active",
      lastTested: "2024-05-10",
      nextTest: "2024-08-10",
      coverage: 92,
      rto: "2 hours",
      rpo: "30 minutes"
    },
    {
      plan: "Pandemic Response",
      status: "Needs Update",
      lastTested: "2024-02-28",
      nextTest: "2024-05-28",
      coverage: 78,
      rto: "12 hours",
      rpo: "4 hours"
    }
  ];

  const criticalProcesses = [
    {
      process: "Milk Production & Processing",
      priority: "Critical",
      backupLocation: "Secondary Plant",
      recovery: "2 hours",
      status: "Protected"
    },
    {
      process: "Quality Control Testing",
      priority: "High",
      backupLocation: "Mobile Lab",
      recovery: "4 hours",
      status: "Protected"
    },
    {
      process: "Customer Order Processing",
      priority: "High",
      backupLocation: "Cloud System",
      recovery: "1 hour",
      status: "Protected"
    },
    {
      process: "Financial Transactions",
      priority: "Critical",
      backupLocation: "Backup Datacenter",
      recovery: "30 minutes",
      status: "Protected"
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 text-white';
      case 'protected': return 'bg-green-500 text-white';
      case 'under review': return 'bg-yellow-500 text-white';
      case 'needs update': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Business Continuity Planning</h3>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Continuity Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {continuityPlans.map((plan, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{plan.plan}</h4>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span className="font-medium">{plan.coverage}%</span>
                  </div>
                  <Progress value={plan.coverage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">RTO</p>
                    <p className="font-medium">{plan.rto}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RPO</p>
                    <p className="font-medium">{plan.rpo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Tested</p>
                    <p className="font-medium">{plan.lastTested}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Test</p>
                    <p className="font-medium">{plan.nextTest}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Processes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalProcesses.map((process, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{process.process}</h4>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(process.priority)}>
                      {process.priority}
                    </Badge>
                    <Badge className={getStatusColor(process.status)}>
                      {process.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Backup Location</p>
                    <p className="font-medium">{process.backupLocation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recovery Time</p>
                    <p className="font-medium">{process.recovery}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Continuity Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Test DR Plan
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Update Plans
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Validate Recovery
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContinuityPlanning;
