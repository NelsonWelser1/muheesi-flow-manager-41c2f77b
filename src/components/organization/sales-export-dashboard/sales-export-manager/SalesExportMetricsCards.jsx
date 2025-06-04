
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Globe, Users, Package, DollarSign, Target } from 'lucide-react';

const SalesExportMetricsCards = () => {
  const metrics = [
    {
      title: "Total Sales Revenue",
      value: "$3.2M",
      change: "+18.5% vs last quarter",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Export Revenue",
      value: "$2.1M",
      change: "65.6% of total sales",
      icon: Globe,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: "148",
      change: "+12 new this month",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Export Orders",
      value: "89",
      change: "32 pending shipment",
      icon: Package,
      color: "text-orange-600"
    },
    {
      title: "Sales Target",
      value: "87%",
      change: "Q2 2024 achievement",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Market Growth",
      value: "+23%",
      change: "Year-over-year expansion",
      icon: TrendingUp,
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

export default SalesExportMetricsCards;
