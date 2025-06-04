
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

const OperationsReports = () => {
  const reportTypes = [
    {
      name: "Daily Production Report",
      description: "Production metrics and efficiency data",
      lastGenerated: "Today, 8:00 AM",
      frequency: "Daily"
    },
    {
      name: "Weekly Inventory Report",
      description: "Stock levels and movement analysis",
      lastGenerated: "Monday, 6:00 AM",
      frequency: "Weekly"
    },
    {
      name: "Quality Control Summary",
      description: "Quality metrics and compliance status",
      lastGenerated: "Yesterday, 5:00 PM",
      frequency: "Daily"
    },
    {
      name: "Resource Utilization Report",
      description: "Staff and equipment utilization analysis",
      lastGenerated: "Last Friday",
      frequency: "Weekly"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Operations Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{report.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                <p className="text-xs text-muted-foreground">
                  Last generated: {report.lastGenerated} • {report.frequency}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="h-20 flex-col">
          <Calendar className="h-6 w-6 mb-2" />
          Schedule Reports
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <BarChart3 className="h-6 w-6 mb-2" />
          Custom Analytics
        </Button>
      </div>
    </div>
  );
};

export default OperationsReports;
