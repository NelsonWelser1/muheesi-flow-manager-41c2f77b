
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Package, TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react';

const FactoryMetricsCards = () => {
  const metrics = [
    {
      title: "Overall Production Efficiency",
      value: "92.8%",
      change: "+3.2% from last week",
      icon: Factory,
      color: "text-blue-600"
    },
    {
      title: "Quality Pass Rate",
      value: "97.5%",
      change: "+1.8% improvement",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Active Production Lines",
      value: "4/5",
      change: "1 line in maintenance",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Staff on Duty",
      value: "28/32",
      change: "4 on leave",
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Equipment Uptime",
      value: "94.2%",
      change: "+2.1% this month",
      icon: Clock,
      color: "text-cyan-600"
    },
    {
      title: "Critical Alerts",
      value: "2",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-red-600"
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

export default FactoryMetricsCards;
