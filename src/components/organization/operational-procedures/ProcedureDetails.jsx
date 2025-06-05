
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Share,
  Clock,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Target,
  Users,
  History,
  MessageSquare
} from 'lucide-react';

const ProcedureDetails = ({ procedure, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800"><FileText className="h-3 w-3 mr-1" />Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Mock data for additional details
  const procedureSteps = [
    "Collect milk samples from each delivery truck upon arrival",
    "Test milk temperature using calibrated thermometer (must be ≤ 4°C)",
    "Perform visual inspection for color, consistency, and foreign matter",
    "Conduct pH testing using digital meter (acceptable range: 6.6-6.8)",
    "Test for antibiotic residues using rapid detection kit",
    "Record all test results in quality control log",
    "Accept or reject milk batch based on test results",
    "Notify production team of approved batches for processing"
  ];

  const complianceHistory = [
    { date: "2024-01-15", score: 98, notes: "All requirements met" },
    { date: "2024-01-01", score: 96, notes: "Minor documentation gap" },
    { date: "2023-12-15", score: 100, notes: "Perfect compliance" },
    { date: "2023-12-01", score: 94, notes: "Temperature monitoring issue" },
  ];

  const versionHistory = [
    { version: "2.1", date: "2024-01-15", changes: "Updated temperature requirements", author: "Dr. Sarah Johnson" },
    { version: "2.0", date: "2023-11-20", changes: "Added antibiotic testing protocol", author: "Quality Team" },
    { version: "1.5", date: "2023-08-10", changes: "Revised documentation format", author: "Dr. Sarah Johnson" },
    { version: "1.0", date: "2023-01-15", changes: "Initial procedure creation", author: "Dr. Sarah Johnson" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Procedures
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Procedure
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                {procedure.title}
              </CardTitle>
              <p className="text-muted-foreground mt-2">{procedure.description}</p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(procedure.status)}
              {getPriorityBadge(procedure.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{procedure.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{procedure.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">v{procedure.version}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{procedure.lastUpdated}</p>
              </div>
            </div>
          </div>

          {procedure.status === 'active' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Compliance Rate</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 transition-all duration-300"
                        style={{ width: `${procedure.compliance}%` }}
                      />
                    </div>
                    <span className="text-green-800 font-bold">{procedure.compliance}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Procedure Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {procedureSteps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Assigned Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{procedure.createdBy}</p>
                      <p className="text-sm text-muted-foreground">Procedure Owner</p>
                    </div>
                    <Badge variant="outline">Owner</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Quality Team</p>
                      <p className="text-sm text-muted-foreground">Executors</p>
                    </div>
                    <Badge variant="outline">Executor</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Review Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Review:</span>
                    <span className="font-medium">{procedure.nextReview}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Review Frequency:</span>
                    <span className="font-medium">Every 6 months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reviewer:</span>
                    <span className="font-medium">{procedure.createdBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{record.score}%</div>
                        <div className="text-xs text-muted-foreground">{record.date}</div>
                      </div>
                      <div className="w-2 h-8 bg-green-500 rounded-full opacity-70"></div>
                      <p className="text-muted-foreground">{record.notes}</p>
                    </div>
                    {record.score === 100 && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {record.score < 95 && (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Badge variant="outline">v{version.version}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">{version.changes}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{version.date}</span>
                        <span>•</span>
                        <span>by {version.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      SJ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Dr. Sarah Johnson</span>
                        <span className="text-sm text-muted-foreground">2024-01-15</span>
                      </div>
                      <p className="text-muted-foreground">
                        Updated temperature requirements based on latest food safety regulations. 
                        Please ensure all staff are trained on the new protocols.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      QT
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Quality Team</span>
                        <span className="text-sm text-muted-foreground">2024-01-10</span>
                      </div>
                      <p className="text-muted-foreground">
                        Procedure is working well. Suggest adding a checklist for easier implementation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm">Post Comment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcedureDetails;
