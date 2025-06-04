
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Shield, Wifi, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ITMetricsCards = () => {
  const metrics = [
    {
      title: "System Uptime",
      value: "99.8%",
      change: "↑ 0.2% this month",
      icon: Server,
      color: "text-green-600"
    },
    {
      title: "Security Score",
      value: "94/100",
      change: "↑ 3 points improved",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      title: "Network Performance",
      value: "847ms",
      change: "↓ 12ms faster",
      icon: Wifi,
      color: "text-purple-600"
    },
    {
      title: "Incident Response",
      value: "2.3h",
      change: "Average resolution time",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Active Alerts",
      value: "7",
      change: "3 critical, 4 warnings",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Compliance Status",
      value: "98%",
      change: "All systems compliant",
      icon: CheckCircle,
      color: "text-green-600"
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
            <p className="text-xs text-muted-foreground">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ITMetricsCards;
