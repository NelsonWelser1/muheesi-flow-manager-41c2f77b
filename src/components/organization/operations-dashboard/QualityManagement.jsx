
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Star } from 'lucide-react';

const QualityManagement = () => {
  const qualityMetrics = [
    {
      metric: "Product Quality Score",
      current: 98.7,
      target: 95.0,
      trend: "+1.2%"
    },
    {
      metric: "Customer Satisfaction",
      current: 94.5,
      target: 90.0,
      trend: "+2.1%"
    },
    {
      metric: "Defect Rate",
      current: 0.8,
      target: 2.0,
      trend: "-0.3%"
    },
    {
      metric: "Compliance Score",
      current: 99.2,
      target: 95.0,
      trend: "+0.5%"
    }
  ];

  const qualityChecks = [
    {
      product: "Mozzarella Cheese - Batch #MC2024-015",
      status: "Passed",
      score: 97.5,
      checkedBy: "Jane Smith",
      timestamp: "2024-02-15 09:30"
    },
    {
      product: "Yogurt - Batch #YG2024-082",
      status: "Passed",
      score: 96.8,
      checkedBy: "John Doe",
      timestamp: "2024-02-15 08:45"
    },
    {
      product: "Gouda Cheese - Batch #GC2024-007",
      status: "Pending",
      score: null,
      checkedBy: "Pending",
      timestamp: "2024-02-15 10:00"
    },
    {
      product: "Coffee - Batch #CF2024-023",
      status: "Failed",
      score: 87.2,
      checkedBy: "Mike Johnson",
      timestamp: "2024-02-15 07:15"
    }
  ];

  const qualityStandards = [
    {
      standard: "HACCP Compliance",
      status: "Active",
      lastAudit: "2024-01-20",
      nextAudit: "2024-04-20"
    },
    {
      standard: "ISO 22000",
      status: "Active",
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15"
    },
    {
      standard: "Uganda National Standards",
      status: "Active",
      lastAudit: "2024-02-01",
      nextAudit: "2024-05-01"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed':
        return 'default';
      case 'Failed':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.metric === "Defect Rate" ? `${metric.current}%` : 
                 metric.metric.includes("Score") || metric.metric.includes("Satisfaction") ? 
                 `${metric.current}%` : metric.current}
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}% • {metric.trend}
              </p>
              <Progress 
                value={(metric.current / metric.target) * 100} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Quality Checks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityChecks.map((check, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{check.product}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <Badge variant={getStatusColor(check.status)}>{check.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <p>Score: {check.score ? `${check.score}%` : 'Pending'}</p>
                    <p>Checked by: {check.checkedBy}</p>
                  </div>
                  <div>
                    <p>Time: {check.timestamp}</p>
                  </div>
                </div>
                {check.status === 'Failed' && (
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Review & Reprocess
                  </Button>
                )}
              </div>
            ))}
            <Button className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Conduct New Quality Check
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Quality Standards & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{standard.standard}</h3>
                  <Badge variant="default">{standard.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Last Audit: {standard.lastAudit}</p>
                  <p>Next Audit: {standard.nextAudit}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  View Compliance Report
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Schedule Audit
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityManagement;
