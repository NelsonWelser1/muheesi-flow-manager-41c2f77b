
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const FactoryReports = () => {
  const reportTemplates = [
    {
      name: "Daily Production Summary",
      description: "Comprehensive overview of daily production metrics across all lines",
      frequency: "Daily",
      lastGenerated: "Today, 8:00 AM",
      category: "Production"
    },
    {
      name: "Quality Control Report",
      description: "Quality test results, compliance status, and non-conformance reports",
      frequency: "Daily",
      lastGenerated: "Today, 6:30 AM",
      category: "Quality"
    },
    {
      name: "Equipment Performance Report",
      description: "Equipment uptime, maintenance schedules, and performance metrics",
      frequency: "Weekly",
      lastGenerated: "Monday, 9:00 AM",
      category: "Maintenance"
    },
    {
      name: "Inventory Status Report",
      description: "Current stock levels, consumption rates, and reorder requirements",
      frequency: "Daily",
      lastGenerated: "Today, 7:00 AM",
      category: "Inventory"
    },
    {
      name: "Staff Performance Report",
      description: "Shift attendance, productivity metrics, and training compliance",
      frequency: "Weekly",
      lastGenerated: "Monday, 10:00 AM",
      category: "Human Resources"
    },
    {
      name: "Cost Analysis Report",
      description: "Production costs, resource utilization, and efficiency metrics",
      frequency: "Monthly",
      lastGenerated: "Last Friday",
      category: "Finance"
    }
  ];

  const kpiDashboard = [
    {
      metric: "Overall Equipment Effectiveness (OEE)",
      value: "87.5%",
      target: "90%",
      trend: "+2.3%"
    },
    {
      metric: "First Pass Yield",
      value: "96.8%",
      target: "95%",
      trend: "+1.2%"
    },
    {
      metric: "Production Volume",
      value: "12,850 kg",
      target: "13,000 kg",
      trend: "-1.2%"
    },
    {
      metric: "Energy Efficiency",
      value: "92.3%",
      target: "90%",
      trend: "+3.1%"
    },
    {
      metric: "Safety Score",
      value: "98.9%",
      target: "95%",
      trend: "+0.5%"
    },
    {
      metric: "Customer Satisfaction",
      value: "94.7%",
      target: "90%",
      trend: "+2.8%"
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Production": "bg-blue-100 text-blue-800",
      "Quality": "bg-green-100 text-green-800",
      "Maintenance": "bg-orange-100 text-orange-800",
      "Inventory": "bg-purple-100 text-purple-800",
      "Human Resources": "bg-pink-100 text-pink-800",
      "Finance": "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiDashboard.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{kpi.metric}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">{kpi.trend}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">Target: {kpi.target}</p>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportTemplates.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.frequency} • Last: {report.lastGenerated}
                      </span>
                    </div>
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
          <CardTitle>Report Generation Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generate Custom Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics Dashboard
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoryReports;
