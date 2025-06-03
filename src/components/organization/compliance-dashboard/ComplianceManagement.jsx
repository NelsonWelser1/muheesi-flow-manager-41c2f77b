
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  BookOpen, 
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Eye
} from 'lucide-react';

const ComplianceManagement = () => {
  const [selectedAudit, setSelectedAudit] = useState(null);

  // Sample data
  const auditTracker = [
    { id: 1, name: 'HACCP Compliance Audit', status: 'completed', progress: 100, dueDate: '2024-05-15', findings: 2 },
    { id: 2, name: 'ISO 22000 Annual Review', status: 'in-progress', progress: 75, dueDate: '2024-06-10', findings: 0 },
    { id: 3, name: 'USDA Export Certification', status: 'pending', progress: 25, dueDate: '2024-06-25', findings: 0 },
    { id: 4, name: 'EU Organic Compliance', status: 'scheduled', progress: 0, dueDate: '2024-07-05', findings: 0 }
  ];

  const capaItems = [
    { id: 1, title: 'Temperature Control Improvement', priority: 'high', status: 'open', dueDate: '2024-06-15', assignee: 'John Smith' },
    { id: 2, title: 'Documentation Update - SOP-001', priority: 'medium', status: 'in-progress', dueDate: '2024-06-20', assignee: 'Mary Johnson' },
    { id: 3, title: 'Staff Training on New Procedures', priority: 'low', status: 'completed', dueDate: '2024-05-30', assignee: 'David Wilson' }
  ];

  const regulations = [
    { id: 1, title: 'HACCP Guidelines 2024', category: 'Food Safety', lastUpdated: '2024-05-01', status: 'current' },
    { id: 2, title: 'FDA Export Requirements', category: 'Export', lastUpdated: '2024-04-15', status: 'current' },
    { id: 3, title: 'EU Organic Standards', category: 'Organic', lastUpdated: '2024-03-20', status: 'review-needed' },
    { id: 4, title: 'ISO 22000:2018 Standard', category: 'Quality', lastUpdated: '2024-02-10', status: 'current' }
  ];

  const riskRegister = [
    { id: 1, risk: 'Cold chain temperature deviation', likelihood: 'medium', impact: 'high', mitigation: 'Enhanced monitoring system', owner: 'Operations Team' },
    { id: 2, risk: 'Cross-contamination in processing', likelihood: 'low', impact: 'high', mitigation: 'Strict hygiene protocols', owner: 'QC Team' },
    { id: 3, risk: 'Supplier non-compliance', likelihood: 'medium', impact: 'medium', mitigation: 'Regular supplier audits', owner: 'Procurement Team' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-gray-500';
      case 'open': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="audits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audits">Audit Tracker</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="regulations">Regulation Library</TabsTrigger>
          <TabsTrigger value="risks">Risk Register</TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Audit Tracker</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>

          <div className="grid gap-4">
            {auditTracker.map((audit) => (
              <Card key={audit.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{audit.name}</CardTitle>
                    <Badge className={getStatusColor(audit.status)}>
                      {audit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{audit.progress}%</span>
                      </div>
                      <Progress value={audit.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Due: {audit.dueDate}</span>
                      <span>{audit.findings} findings</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capa" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Corrective & Preventive Actions (CAPA)</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create CAPA
            </Button>
          </div>

          <div className="grid gap-4">
            {capaItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Assignee: {item.assignee}</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Regulation Library</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Regulation
            </Button>
          </div>

          <div className="grid gap-4">
            {regulations.map((reg) => (
              <Card key={reg.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{reg.title}</h4>
                      <p className="text-sm text-muted-foreground">Category: {reg.category}</p>
                    </div>
                    <Badge variant={reg.status === 'current' ? 'outline' : 'secondary'}>
                      {reg.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Last Updated: {reg.lastUpdated}
                    </span>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Register</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Risk
            </Button>
          </div>

          <div className="grid gap-4">
            {riskRegister.map((risk) => (
              <Card key={risk.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">{risk.risk}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Likelihood: </span>
                        <span className={`px-2 py-1 rounded text-xs ${getRiskColor(risk.likelihood)}`}>
                          {risk.likelihood}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact: </span>
                        <span className={`px-2 py-1 rounded text-xs ${getRiskColor(risk.impact)}`}>
                          {risk.impact}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Mitigation:</p>
                      <p>{risk.mitigation}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Owner: {risk.owner}</span>
                      <Button variant="outline" size="sm">
                        Update Risk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceManagement;
