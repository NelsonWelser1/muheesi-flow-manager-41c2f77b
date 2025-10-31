
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, GraduationCap, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const HRMetricsCards = () => {
  const metrics = [
    {
      title: "Total Employees",
      value: "156",
      change: "+12 this month",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Recruitments",
      value: "8",
      change: "5 positions open",
      icon: UserPlus,
      color: "text-success"
    },
    {
      title: "Training Programs",
      value: "24",
      change: "3 new this week",
      icon: GraduationCap,
      color: "text-accent"
    },
    {
      title: "Monthly Payroll",
      value: "UGX 45M",
      change: "+5% from last month",
      icon: DollarSign,
      color: "text-warning"
    },
    {
      title: "Employee Satisfaction",
      value: "87%",
      change: "+3% improvement",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Pending Reviews",
      value: "12",
      change: "Due this week",
      icon: AlertTriangle,
      color: "text-destructive"
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

export default HRMetricsCards;
