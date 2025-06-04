
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Package, TrendingUp, AlertTriangle, Settings, DollarSign } from 'lucide-react';

const OperationsMetricsCards = () => {
  const metrics = [
    {
      title: "Production Efficiency",
      value: "94.2%",
      change: "+2.1% from last month",
      icon: Factory,
      color: "text-blue-600"
    },
    {
      title: "Inventory Turnover",
      value: "8.5x",
      change: "+0.7x improvement",
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Quality Score",
      value: "98.7%",
      change: "+1.2% this quarter",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Operational Costs",
      value: "UGX 125M",
      change: "-5.2% reduction",
      icon: DollarSign,
      color: "text-orange-600"
    },
    {
      title: "Equipment Uptime",
      value: "96.8%",
      change: "+3.1% improvement",
      icon: Settings,
      color: "text-cyan-600"
    },
    {
      title: "Critical Issues",
      value: "3",
      change: "-2 from last week",
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

export default OperationsMetricsCards;
