
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

const FinancialReporting = () => {
  const availableReports = [
    {
      name: "Profit & Loss Statement",
      description: "Comprehensive income statement for the current period",
      lastGenerated: "2024-05-30",
      frequency: "Monthly"
    },
    {
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity overview",
      lastGenerated: "2024-05-30",
      frequency: "Monthly"
    },
    {
      name: "Cash Flow Statement",
      description: "Operating, investing, and financing activities",
      lastGenerated: "2024-05-30",
      frequency: "Monthly"
    },
    {
      name: "Budget vs Actual Report",
      description: "Variance analysis across all departments",
      lastGenerated: "2024-06-01",
      frequency: "Weekly"
    },
    {
      name: "Accounts Aging Report",
      description: "Receivables and payables aging analysis",
      lastGenerated: "2024-06-02",
      frequency: "Weekly"
    },
    {
      name: "Financial Ratios Analysis",
      description: "Key performance indicators and ratios",
      lastGenerated: "2024-05-28",
      frequency: "Quarterly"
    }
  ];

  const recentReports = [
    { name: "May 2024 P&L Statement", date: "2024-05-30", status: "Ready" },
    { name: "Q1 2024 Financial Summary", date: "2024-04-15", status: "Archived" },
    { name: "April Cash Flow Report", date: "2024-04-30", status: "Ready" },
    { name: "Budget Variance - Week 22", date: "2024-06-01", status: "Ready" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Reporting</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Custom Report Builder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableReports.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{report.name}</h4>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last: {report.lastGenerated}</span>
                  <span>Frequency: {report.frequency}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((report, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    report.status === 'Ready' ? 'bg-success/10 text-success border border-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {report.status}
                  </span>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generate Report
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
              Export Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;
