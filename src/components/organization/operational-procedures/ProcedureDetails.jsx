
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  History, 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from "lucide-react";

const ProcedureDetails = ({ procedure, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock detailed procedure data
  const procedureSteps = [
    {
      id: 1,
      title: "Initial Setup",
      description: "Prepare all necessary materials and equipment",
      estimated_time: "15 minutes",
      responsible: "Team Lead",
      status: "completed"
    },
    {
      id: 2,
      title: "Quality Check",
      description: "Perform initial quality assessment",
      estimated_time: "30 minutes",
      responsible: "Quality Inspector",
      status: "completed"
    },
    {
      id: 3,
      title: "Process Execution",
      description: "Execute the main procedure steps",
      estimated_time: "2 hours",
      responsible: "Operations Team",
      status: "in_progress"
    },
    {
      id: 4,
      title: "Final Validation",
      description: "Validate results and document outcomes",
      estimated_time: "45 minutes",
      responsible: "Supervisor",
      status: "pending"
    }
  ];

  const revisionHistory = [
    {
      version: "2.1",
      date: "2024-05-15",
      author: "John Smith",
      changes: "Updated safety protocols and added new compliance requirements"
    },
    {
      version: "2.0",
      date: "2024-04-01",
      author: "Jane Doe",
      changes: "Major revision with restructured workflow"
    },
    {
      version: "1.9",
      date: "2024-03-15",
      author: "Mike Johnson",
      changes: "Minor corrections and clarifications"
    }
  ];

  const getStepStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Procedures
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{procedure.title}</h2>
            <p className="text-gray-600">{procedure.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Procedure
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Version</p>
              <p className="text-xl font-bold">v{procedure.version}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Compliance</p>
              <p className="text-xl font-bold text-green-600">{procedure.compliance}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Steps</p>
              <p className="text-xl font-bold">{procedure.steps}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-xl font-bold">{procedure.department}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Procedure Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={procedure.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {procedure.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <Badge className={procedure.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                      {procedure.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{procedure.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responsible:</span>
                    <span>{procedure.responsible}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Compliance Progress</h3>
                <div className="space-y-2">
                  <Progress value={procedure.compliance} className="w-full" />
                  <p className="text-sm text-gray-600">
                    {procedure.compliance}% of requirements met
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <h3 className="font-semibold">Procedure Steps</h3>
            <div className="space-y-4">
              {procedureSteps.map((step, index) => (
                <Card key={step.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-400">
                          {index + 1}
                        </span>
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>⏱️ {step.estimated_time}</span>
                          <span>👤 {step.responsible}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h3 className="font-semibold">Revision History</h3>
            <div className="space-y-4">
              {revisionHistory.map((revision) => (
                <Card key={revision.version}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Version {revision.version}</span>
                          <span className="text-sm text-gray-500">{revision.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{revision.changes}</p>
                        <p className="text-xs text-gray-500 mt-2">by {revision.author}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <h3 className="font-semibold">Team & Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Quality Manager</p>
                      <p className="text-sm text-gray-600">Primary Responsible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">Operations Team</p>
                      <p className="text-sm text-gray-600">Execution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcedureDetails;
