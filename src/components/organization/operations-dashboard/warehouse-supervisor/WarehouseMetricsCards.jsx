
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Users, Truck, CheckCircle } from 'lucide-react';

const WarehouseMetricsCards = () => {
  const metrics = [
    {
      title: "Total Inventory",
      value: "24,847",
      change: "+12% this month",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Order Fulfillment",
      value: "94.2%",
      change: "+2.1% vs last month",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Warehouse Utilization",
      value: "78%",
      change: "Optimal capacity",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Active Staff",
      value: "32",
      change: "4 on leave today",
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Pending Shipments",
      value: "127",
      change: "8 urgent deliveries",
      icon: Truck,
      color: "text-yellow-600"
    },
    {
      title: "Quality Issues",
      value: "3",
      change: "2 resolved today",
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

export default WarehouseMetricsCards;
