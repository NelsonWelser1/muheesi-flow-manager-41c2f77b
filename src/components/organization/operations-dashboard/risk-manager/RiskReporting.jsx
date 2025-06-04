
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const RiskReporting = () => {
  const reportTemplates = [
    {
      name: "Executive Risk Summary",
      frequency: "Monthly",
      lastGenerated: "2024-05-01",
      nextDue: "2024-06-01",
      recipients: ["CEO", "Board of Directors"],
      status: "Scheduled"
    },
    {
      name: "Operational Risk Report",
      frequency: "Weekly",
      lastGenerated: "2024-05-20",
      nextDue: "2024-05-27",
      recipients: ["Operations Manager", "Risk Committee"],
      status: "Active"
    },
    {
      name: "Compliance Status Report",
      frequency: "Quarterly",
      lastGenerated: "2024-04-01",
      nextDue: "2024-07-01",
      recipients: ["Compliance Officer", "External Auditors"],
      status: "Scheduled"
    },
    {
      name: "Incident Analysis Report",
      frequency: "As Required",
      lastGenerated: "2024-05-15",
      nextDue: "As Required",
      recipients: ["Risk Manager", "Department Heads"],
      status: "Active"
    }
  ];

  const recentReports = [
    {
      title: "Risk Assessment Q2 2024",
      type: "Risk Analysis",
      generatedDate: "2024-05-22",
      generatedBy: "Risk Manager",
      format: "PDF",
      pages: 24,
      status: "Completed"
    },
    {
      title: "Compliance Audit Results",
      type: "Compliance",
      generatedDate: "2024-05-20",
      generatedBy: "Compliance Officer",
      format: "PDF",
      pages: 18,
      status: "Completed"
    },
    {
      title: "Incident Response Metrics",
      type: "Incident Analysis",
      generatedDate: "2024-05-18",
      generatedBy: "Risk Manager",
      format: "Excel",
      pages: 12,
      status: "Completed"
    }
  ];

  const dashboardMetrics = [
    {
      metric: "Total Risk Exposure",
      value: "Medium",
      trend: "Stable",
      change: "0%"
    },
    {
      metric: "Open Incidents",
      value: "12",
      trend: "Decreasing",
      change: "-25%"
    },
    {
      metric: "Compliance Score",
      value: "94.5%",
      trend: "Increasing",
      change: "+2.1%"
    },
    {
      metric: "Risk Assessments",
      value: "28",
      trend: "Stable",
      change: "+3"
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend.toLowerCase()) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600 rotate-90" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Risk Reporting</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Custom Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className="text-muted-foreground">{metric.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">Frequency: {template.frequency}</p>
                  </div>
                  <Badge className={getStatusColor(template.status)}>
                    {template.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Last Generated</p>
                    <p className="font-medium">{template.lastGenerated}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Due</p>
                    <p className="font-medium">{template.nextDue}</p>
                  </div>
                </div>
                
                <div className="text-sm mb-3">
                  <p className="text-muted-foreground">Recipients</p>
                  <p className="font-medium">{template.recipients.join(", ")}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Generated Date</p>
                    <p className="font-medium">{report.generatedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Generated By</p>
                    <p className="font-medium">{report.generatedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Format</p>
                    <p className="font-medium">{report.format}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pages</p>
                    <p className="font-medium">{report.pages}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Dashboard Export
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Custom Report
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Report
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Risk Alert Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskReporting;
