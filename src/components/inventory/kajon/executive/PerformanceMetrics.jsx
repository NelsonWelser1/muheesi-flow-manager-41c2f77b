
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3, Truck } from 'lucide-react';

const PerformanceMetrics = () => {
  // Sample performance metrics data for executive view
  const metrics = [
    {
      title: "Total Revenue",
      value: "$1.24M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Total revenue from all coffee sales"
    },
    {
      title: "Coffee Volume",
      value: "876 MT",
      change: "+8.2%",
      trend: "up",
      icon: Package,
      description: "Total volume of coffee processed"
    },
    {
      title: "Export Margin",
      value: "24.6%",
      change: "-1.3%",
      trend: "down",
      icon: BarChart3,
      description: "Profit margin on export sales"
    },
    {
      title: "Logistics Cost",
      value: "$98.5K",
      change: "-5.2%",
      trend: "up", // Trend is "up" because cost reduction is positive
      icon: Truck,
      description: "Total cost of logistics operations"
    }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                </div>
                <div className={`p-2 rounded-full ${
                  metric.trend === 'up' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change} 
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last quarter</span>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
