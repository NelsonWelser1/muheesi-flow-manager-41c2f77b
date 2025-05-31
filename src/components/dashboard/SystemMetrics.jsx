
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Activity } from 'lucide-react';

const SystemMetrics = ({ expanded = false }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '12.5M UGX',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Inventory',
      value: '2,847',
      change: '+5.2%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'System Users',
      value: '156',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Daily Operations',
      value: '89%',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const systemHealth = [
    { name: 'Database', status: 98, color: 'bg-green-500' },
    { name: 'API Performance', status: 95, color: 'bg-blue-500' },
    { name: 'Storage', status: 87, color: 'bg-yellow-500' },
    { name: 'Network', status: 92, color: 'bg-purple-500' }
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`grid ${expanded ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <div
                key={metric.title}
                className={`p-4 rounded-lg ${metric.bgColor} border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-white ${metric.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    {metric.change}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900">{metric.value}</h4>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            );
          })}
        </div>

        {expanded && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">System Health</h4>
            {systemHealth.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">{item.status}%</span>
                </div>
                <Progress value={item.status} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;
