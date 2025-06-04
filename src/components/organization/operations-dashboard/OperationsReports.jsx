
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, BarChart3, TrendingUp, Factory } from 'lucide-react';

const OperationsReports = () => {
  const reportCategories = [
    {
      title: "Production Reports",
      icon: Factory,
      reports: [
        "Daily Production Summary",
        "Equipment Utilization Report",
        "Production Efficiency Analysis",
        "Downtime Analysis Report"
      ]
    },
    {
      title: "Quality Reports",
      icon: TrendingUp,
      reports: [
        "Quality Control Summary",
        "Defect Analysis Report",
        "Compliance Status Report",
        "Customer Feedback Analysis"
      ]
    },
    {
      title: "Operational Analytics",
      icon: BarChart3,
      reports: [
        "Cost Analysis Report",
        "Resource Utilization Report",
        "Process Optimization Summary",
        "Performance Benchmarking"
      ]
    }
  ];

  const recentReports = [
    {
      name: "February 2024 Production Summary",
      type: "Production",
      generatedDate: "2024-02-15",
      size: "3.2 MB",
      format: "PDF",
      status: "Ready"
    },
    {
      name: "Q1 2024 Quality Analysis",
      type: "Quality",
      generatedDate: "2024-02-14",
      size: "2.8 MB",
      format: "Excel",
      status: "Ready"
    },
    {
      name: "Equipment Utilization - Week 7",
      type: "Operations",
      generatedDate: "2024-02-13",
      size: "1.5 MB",
      format: "PDF",
      status: "Ready"
    },
    {
      name: "Cost Analysis - January 2024",
      type: "Finance",
      generatedDate: "2024-02-12",
      size: "2.1 MB",
      format: "Excel",
      status: "Ready"
    }
  ];

  const scheduledReports = [
    {
      name: "Weekly Production Summary",
      frequency: "Weekly",
      nextGeneration: "2024-02-19",
      recipients: "Production Team, Management"
    },
    {
      name: "Monthly Quality Report",
      frequency: "Monthly",
      nextGeneration: "2024-03-01",
      recipients: "Quality Team, CEO"
    },
    {
      name: "Daily Operations Dashboard",
      frequency: "Daily",
      nextGeneration: "2024-02-16",
      recipients: "Operations Team"
    }
  ];

  const kpiReports = [
    {
      kpi: "Overall Equipment Effectiveness",
      current: "84.5%",
      target: "90%",
      trend: "+2.3%"
    },
    {
      kpi: "Production Efficiency",
      current: "92.1%",
      target: "95%",
      trend: "+1.8%"
    },
    {
      kpi: "Quality Score",
      current: "98.7%",
      target: "95%",
      trend: "+0.5%"
    },
    {
      kpi: "Cost per Unit",
      current: "UGX 1,250",
      target: "UGX 1,200",
      trend: "-3.2%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.reports.map((report, reportIndex) => (
                <div key={reportIndex} className="flex justify-between items-center">
                  <span className="text-sm">{report}</span>
                  <Button size="sm" variant="outline">
                    Generate
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{report.generatedDate}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <Badge variant="outline">{report.format}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiReports.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{kpi.kpi}</h3>
                  <Badge variant="outline" className="text-green-600">
                    {kpi.trend}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current: {kpi.current}</span>
                  <span>Target: {kpi.target}</span>
                </div>
              </div>
            ))}
            <Button className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate KPI Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduledReports.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{report.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Frequency: {report.frequency}</p>
                  <p>Next: {report.nextGeneration}</p>
                  <p>Recipients: {report.recipients}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Modify Schedule
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationsReports;
