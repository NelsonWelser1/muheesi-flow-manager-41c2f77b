
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Package, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

const ProductMetricsCards = () => {
  const metrics = [
    {
      title: "Products in Pipeline",
      value: "23",
      change: "+4 new concepts",
      icon: Lightbulb,
      color: "text-yellow-600"
    },
    {
      title: "Active Products",
      value: "12",
      change: "2 launched this quarter",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Time to Market",
      value: "8.2 months",
      change: "↓ 1.3 months improved",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Market Success Rate",
      value: "78%",
      change: "+5% vs industry avg",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "R&D Investment",
      value: "$2.4M",
      change: "18% of revenue",
      icon: DollarSign,
      color: "text-orange-600"
    },
    {
      title: "Team Productivity",
      value: "94%",
      change: "Sprint completion rate",
      icon: Users,
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

export default ProductMetricsCards;
