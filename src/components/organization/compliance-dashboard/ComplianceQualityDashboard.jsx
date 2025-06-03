
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Calendar,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus
} from 'lucide-react';
import ComplianceManagement from './ComplianceManagement';
import QualityControl from './QualityControl';
import DocumentManagement from './DocumentManagement';
import ReportingDashboard from './ReportingDashboard';
import TaskCalendarTools from './TaskCalendarTools';
import CollaborationTools from './CollaborationTools';

const ComplianceQualityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample KPI data
  const kpiData = {
    inspectionPassRate: 94.2,
    nonComplianceRate: 2.1,
    exportReadiness: 98.5,
    pendingAudits: 3,
    criticalIssues: 1,
    completedInspections: 156
  };

  const recentAlerts = [
    { id: 1, type: 'critical', message: 'Temperature deviation detected in Cold Room A', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'pH level approaching limits in Batch C-2024-001', time: '4 hours ago' },
    { id: 3, type: 'info', message: 'Monthly audit scheduled for next week', time: '1 day ago' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertBadgeVariant = (type) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance & Quality Control</h1>
          <p className="text-muted-foreground">Monitor compliance status, quality metrics, and export readiness</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Real-time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Real-time Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
                <Badge variant={getAlertBadgeVariant(alert.type)}>
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inspection Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.inspectionPassRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non-compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpiData.nonComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">-0.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Export Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData.exportReadiness}%</div>
            <p className="text-xs text-muted-foreground">Ready for shipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingAudits}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpiData.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.completedInspections}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Quality</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ReportingDashboard />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceManagement />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControl />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentManagement />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskCalendarTools />
        </TabsContent>

        <TabsContent value="collaboration">
          <CollaborationTools />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceQualityDashboard;
