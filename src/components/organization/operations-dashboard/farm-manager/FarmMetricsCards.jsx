
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Calendar, Droplets, Thermometer, TrendingUp, CalendarCheck } from 'lucide-react';

const FarmMetricsCards = () => {
  const metrics = [
    {
      title: "Active Crops",
      value: "8",
      change: "Coffee, Maize, Beans",
      icon: Sprout,
      color: "text-green-600"
    },
    {
      title: "Livestock Count",
      value: "247",
      change: "15 new calves this month",
      icon: Calendar,
      color: "text-brown-600"
    },
    {
      title: "Farm Yield",
      value: "12.5T",
      change: "+8% vs last season",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Soil Moisture",
      value: "68%",
      change: "Optimal for crops",
      icon: Droplets,
      color: "text-cyan-600"
    },
    {
      title: "Temperature",
      value: "24°C",
      change: "Perfect growing conditions",
      icon: Thermometer,
      color: "text-orange-600"
    },
    {
      title: "Next Harvest",
      value: "21 days",
      change: "Coffee cherries ready",
      icon: CalendarCheck,
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
            <p className="text-xs text-muted-foreground">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FarmMetricsCards;
