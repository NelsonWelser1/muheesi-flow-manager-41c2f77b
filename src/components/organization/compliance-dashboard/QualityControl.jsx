
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Star,
  Plus,
  Search,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

const QualityControl = () => {
  const [newInspection, setNewInspection] = useState({
    batchId: '',
    product: '',
    inspector: '',
    notes: ''
  });

  // Sample data
  const inspectionForms = [
    { id: 1, batchId: 'B-2024-001', product: 'Aged Cheese', inspector: 'Jane Doe', date: '2024-06-01', status: 'passed', grade: 'A' },
    { id: 2, batchId: 'B-2024-002', product: 'Fresh Milk', inspector: 'John Smith', date: '2024-06-02', status: 'failed', grade: 'C' },
    { id: 3, batchId: 'B-2024-003', product: 'Yogurt', inspector: 'Jane Doe', date: '2024-06-03', status: 'passed', grade: 'A+' },
    { id: 4, batchId: 'B-2024-004', product: 'Coffee Beans', inspector: 'Mike Wilson', date: '2024-06-03', status: 'pending', grade: '-' }
  ];

  const qcLogs = [
    { id: 1, timestamp: '2024-06-03 14:30', action: 'Temperature check - Cold Room A', result: '2°C - Within range', user: 'Jane Doe' },
    { id: 2, timestamp: '2024-06-03 13:15', action: 'pH level test - Batch B-2024-003', result: '6.5 - Optimal', user: 'John Smith' },
    { id: 3, timestamp: '2024-06-03 12:00', action: 'Moisture content analysis', result: '12.5% - Acceptable', user: 'Mike Wilson' },
    { id: 4, timestamp: '2024-06-03 11:45', action: 'Visual inspection - Packaging line', result: 'No defects found', user: 'Jane Doe' }
  ];

  const gradingReports = [
    { product: 'Aged Cheese', grade: 'A+', percentage: 85, trend: 'up' },
    { product: 'Fresh Milk', grade: 'A', percentage: 78, trend: 'stable' },
    { product: 'Yogurt', grade: 'A', percentage: 82, trend: 'up' },
    { product: 'Coffee Beans', grade: 'B+', percentage: 72, trend: 'down' }
  ];

  const alerts = [
    { id: 1, type: 'critical', message: 'Batch B-2024-002 failed quality inspection', time: '1 hour ago', action: 'Quarantine initiated' },
    { id: 2, type: 'warning', message: 'Temperature spike detected in aging room', time: '3 hours ago', action: 'Maintenance scheduled' },
    { id: 3, type: 'info', message: 'New quality standards published', time: '1 day ago', action: 'Review required' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-blue-600';
    if (grade.includes('C')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const handleInspectionSubmit = () => {
    console.log('New inspection:', newInspection);
    // Reset form
    setNewInspection({ batchId: '', product: '', inspector: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inspections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inspections">Inspection Forms</TabsTrigger>
          <TabsTrigger value="logs">QC Logs</TabsTrigger>
          <TabsTrigger value="grading">Product Grading</TabsTrigger>
          <TabsTrigger value="alerts">Quality Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quality Inspection Forms</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>

          {/* Quick inspection form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Inspection Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Input 
                  placeholder="Batch ID" 
                  value={newInspection.batchId}
                  onChange={(e) => setNewInspection({...newInspection, batchId: e.target.value})}
                />
                <Input 
                  placeholder="Product" 
                  value={newInspection.product}
                  onChange={(e) => setNewInspection({...newInspection, product: e.target.value})}
                />
                <Input 
                  placeholder="Inspector" 
                  value={newInspection.inspector}
                  onChange={(e) => setNewInspection({...newInspection, inspector: e.target.value})}
                />
                <Button onClick={handleInspectionSubmit}>Submit</Button>
              </div>
              <Textarea 
                placeholder="Inspection notes..."
                value={newInspection.notes}
                onChange={(e) => setNewInspection({...newInspection, notes: e.target.value})}
              />
            </CardContent>
          </Card>

          {/* Inspection list */}
          <div className="grid gap-4">
            {inspectionForms.map((inspection) => (
              <Card key={inspection.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{inspection.product}</h4>
                      <p className="text-sm text-muted-foreground">Batch: {inspection.batchId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getGradeColor(inspection.grade)}`}>
                        Grade: {inspection.grade}
                      </Badge>
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Inspector: {inspection.inspector}</span>
                    <span>Date: {inspection.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quality Control Logs</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9" />
              </div>
              <Button variant="outline" size="sm">
                Export Logs
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {qcLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-green-600">{log.result}</p>
                      <p className="text-xs text-muted-foreground">By {log.user} at {log.timestamp}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grading" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Grading Reports</h3>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
          </div>

          <div className="grid gap-4">
            {gradingReports.map((report, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{report.product}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-lg font-bold ${getGradeColor(report.grade)}`}>
                          {report.grade}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({report.percentage}% pass rate)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(report.trend)}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= (report.grade.includes('A+') ? 5 : report.grade.includes('A') ? 4 : 3) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quality Alerts</h3>
            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      {alert.type === 'critical' && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                      {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                      {alert.type === 'info' && <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />}
                      <div className="space-y-1">
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-green-600">Action: {alert.action}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <Badge variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'outline'}>
                      {alert.type}
                    </Badge>
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

export default QualityControl;
