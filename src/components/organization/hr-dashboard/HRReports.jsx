
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, BarChart3, Users, DollarSign } from 'lucide-react';

const HRReports = () => {
  const reportCategories = [
    {
      title: "Employee Reports",
      icon: Users,
      reports: [
        "Employee Directory",
        "Department Analysis",
        "Attendance Report",
        "Employee Turnover"
      ]
    },
    {
      title: "Payroll Reports",
      icon: DollarSign,
      reports: [
        "Monthly Payroll Summary",
        "Tax Deductions Report",
        "Company-wise Payroll",
        "Overtime Analysis"
      ]
    },
    {
      title: "Performance Reports",
      icon: BarChart3,
      reports: [
        "Performance Review Summary",
        "Training Completion Report",
        "Goal Achievement Report",
        "Performance Trends"
      ]
    }
  ];

  const recentReports = [
    {
      name: "January 2024 Payroll Summary",
      type: "Payroll",
      generatedDate: "2024-02-01",
      size: "2.3 MB",
      format: "PDF"
    },
    {
      name: "Q4 2023 Performance Review",
      type: "Performance",
      generatedDate: "2024-01-15",
      size: "1.8 MB",
      format: "Excel"
    },
    {
      name: "Employee Attendance Report - January",
      type: "Employee",
      generatedDate: "2024-01-31",
      size: "945 KB",
      format: "PDF"
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
                  <FileText className="h-8 w-8 text-primary" />
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
    </div>
  );
};

export default HRReports;
