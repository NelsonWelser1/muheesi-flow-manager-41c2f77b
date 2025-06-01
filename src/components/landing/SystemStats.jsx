
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SystemStats = () => {
  const stats = [
    {
      title: "Total Inventory Value",
      value: "UGX 2.4B",
      change: "+12%",
      trend: "up",
      description: "Across all companies"
    },
    {
      title: "Active Employees",
      value: "847",
      change: "+5%",
      trend: "up",
      description: "System users"
    },
    {
      title: "Monthly Production",
      value: "156,000",
      change: "-2%",
      trend: "down",
      description: "Units processed"
    },
    {
      title: "Order Fulfillment",
      value: "98.5%",
      change: "0%",
      trend: "stable",
      description: "Success rate"
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">System Overview</h2>
          <p className="text-lg text-gray-600">
            Real-time insights into your integrated business operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">
                      vs last month
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
