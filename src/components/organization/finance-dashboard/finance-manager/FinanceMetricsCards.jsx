
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CreditCard, Banknote } from 'lucide-react';

const FinanceMetricsCards = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$2.8M",
      change: "+12.5% from last month",
      icon: DollarSign,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Operating Expenses",
      value: "$1.2M",
      change: "+3.2% from last month",
      icon: TrendingDown,
      color: "text-red-600",
      trend: "up"
    },
    {
      title: "Net Profit Margin",
      value: "57.1%",
      change: "+8.3% improvement",
      icon: TrendingUp,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Cash Flow",
      value: "$485K",
      change: "Positive this quarter",
      icon: Banknote,
      color: "text-blue-600",
      trend: "stable"
    },
    {
      title: "Accounts Receivable",
      value: "$320K",
      change: "15 overdue accounts",
      icon: CreditCard,
      color: "text-yellow-600",
      trend: "warning"
    },
    {
      title: "Budget Variance",
      value: "-2.8%",
      change: "Under budget YTD",
      icon: AlertCircle,
      color: "text-green-600",
      trend: "good"
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

export default FinanceMetricsCards;
