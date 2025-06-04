
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, Calendar, Award, DollarSign } from 'lucide-react';

const AssociationMetricsCards = () => {
  const metrics = [
    {
      title: "Active Members",
      value: "1,247",
      change: "+58 new this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Member Engagement",
      value: "87%",
      change: "+5% improvement",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Training Completion",
      value: "94%",
      change: "628 certificates issued",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Upcoming Events",
      value: "12",
      change: "3 this week",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Partnership Projects",
      value: "8",
      change: "2 new partnerships",
      icon: Target,
      color: "text-red-600"
    },
    {
      title: "Funding Secured",
      value: "$45K",
      change: "This quarter",
      icon: DollarSign,
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

export default AssociationMetricsCards;
