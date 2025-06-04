
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Target, DollarSign, Eye, Share2 } from 'lucide-react';

const MarketingMetricsCards = () => {
  const metrics = [
    {
      title: "Campaign ROI",
      value: "245%",
      change: "+18% this quarter",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Brand Awareness",
      value: "73%",
      change: "+12% improvement",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Customer Acquisition",
      value: "1,847",
      change: "New customers this month",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Market Share",
      value: "18.6%",
      change: "+2.3% vs competitors",
      icon: Target,
      color: "text-orange-600"
    },
    {
      title: "Marketing Spend",
      value: "$124K",
      change: "Within 95% of budget",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Social Engagement",
      value: "8.4%",
      change: "+1.2% engagement rate",
      icon: Share2,
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

export default MarketingMetricsCards;
