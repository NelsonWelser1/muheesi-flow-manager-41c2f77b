
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

const QualityManagement = () => {
  const qualityMetrics = [
    {
      product: "Mozzarella Cheese",
      score: 98.5,
      status: "Excellent",
      lastCheck: "2 hours ago"
    },
    {
      product: "Gouda Cheese",
      score: 96.2,
      status: "Good",
      lastCheck: "4 hours ago"
    },
    {
      product: "Yogurt",
      score: 99.1,
      status: "Excellent",
      lastCheck: "1 hour ago"
    },
    {
      product: "Processed Coffee",
      score: 94.8,
      status: "Good",
      lastCheck: "6 hours ago"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
        return 'default';
      case 'Good':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Good':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quality Control Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(metric.status)}
                <div>
                  <h3 className="font-semibold">{metric.product}</h3>
                  <p className="text-sm text-muted-foreground">Last check: {metric.lastCheck}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-lg">{metric.score}%</p>
                  <Badge variant={getStatusColor(metric.status)}>{metric.status}</Badge>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="h-20 flex-col">
          <FileText className="h-6 w-6 mb-2" />
          Generate Quality Report
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <AlertTriangle className="h-6 w-6 mb-2" />
          Schedule Inspection
        </Button>
      </div>
    </div>
  );
};

export default QualityManagement;
