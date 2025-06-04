
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const RiskMetricsCards = () => {
  const metrics = [
    {
      title: "Overall Risk Score",
      value: "Medium",
      score: "7.2/10",
      change: "-0.3 from last month",
      icon: Shield,
      color: "text-orange-600"
    },
    {
      title: "Critical Risks",
      value: "3",
      change: "Requires immediate attention",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Compliance Rate",
      value: "94.5%",
      change: "+2.1% improvement",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Open Incidents",
      value: "12",
      change: "5 resolved this week",
      icon: AlertCircle,
      color: "text-yellow-600"
    },
    {
      title: "Risk Assessments",
      value: "28",
      change: "Due for review this month",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Risk Trend",
      value: "Stable",
      change: "Consistent with targets",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.score && (
              <div className="text-lg font-medium text-muted-foreground">{metric.score}</div>
            )}
            <p className="text-xs text-muted-foreground">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RiskMetricsCards;
