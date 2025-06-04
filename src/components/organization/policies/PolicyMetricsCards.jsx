
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const PolicyMetricsCards = () => {
  const metrics = [
    {
      title: "Total Policies",
      value: "47",
      change: "+3 this month",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Staff Compliance",
      value: "96.8%",
      change: "+2.3% vs last month",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Pending Reviews",
      value: "12",
      change: "Due this week",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Active Users",
      value: "284",
      change: "Accessing policies",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Quality Score",
      value: "98.5%",
      change: "Standards compliance",
      icon: TrendingUp,
      color: "text-cyan-600"
    },
    {
      title: "Updates Required",
      value: "5",
      change: "Policies need revision",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">{metric.title}</CardTitle>
            <metric.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${metric.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground truncate">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PolicyMetricsCards;
