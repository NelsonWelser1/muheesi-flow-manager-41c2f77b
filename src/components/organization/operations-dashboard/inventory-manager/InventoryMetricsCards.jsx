
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, DollarSign, BarChart3, CheckCircle } from 'lucide-react';

const InventoryMetricsCards = () => {
  const metrics = [
    {
      title: "Total Stock Value",
      value: "$2.8M",
      change: "+8.3% vs last month",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Stock Turnover",
      value: "6.2x",
      change: "+0.8 improvement",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Items in Stock",
      value: "12,847",
      change: "Across 43 categories",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      change: "Require replenishment",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Quality Rating",
      value: "98.7%",
      change: "+1.2% this quarter",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Procurement ROI",
      value: "34%",
      change: "Cost optimization",
      icon: BarChart3,
      color: "text-blue-600"
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

export default InventoryMetricsCards;
