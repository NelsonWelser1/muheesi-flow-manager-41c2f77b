
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const LogisticsMetricsCards = () => {
  const metrics = [
    {
      title: "Fleet Utilization",
      value: "87%",
      change: "+5.2% vs last month",
      icon: Truck,
      color: "text-blue-600"
    },
    {
      title: "On-Time Delivery",
      value: "94.3%",
      change: "+2.1% improvement",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Active Shipments",
      value: "1,247",
      change: "23 pending pickup",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Route Efficiency",
      value: "91.8%",
      change: "Avg 12% fuel savings",
      icon: MapPin,
      color: "text-orange-600"
    },
    {
      title: "Cost per Mile",
      value: "$2.34",
      change: "-8.5% reduction",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Critical Alerts",
      value: "3",
      change: "Require immediate action",
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

export default LogisticsMetricsCards;
