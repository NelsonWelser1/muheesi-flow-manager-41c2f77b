
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Award, BarChart3 } from 'lucide-react';

const PerformanceTracking = () => {
  const salesTargets = [
    {
      metric: "Quarterly Revenue",
      target: 3500000,
      achieved: 3200000,
      percentage: 91.4,
      status: "on-track"
    },
    {
      metric: "Export Volume",
      target: 1200,
      achieved: 1085,
      percentage: 90.4,
      status: "on-track"
    },
    {
      metric: "New Customers",
      target: 25,
      achieved: 28,
      percentage: 112,
      status: "exceeded"
    },
    {
      metric: "Customer Retention",
      target: 95,
      achieved: 93.5,
      percentage: 98.4,
      status: "close"
    }
  ];

  const teamPerformance = [
    { name: "John Makumbi", role: "Sales Executive", target: 850000, achieved: 920000, percentage: 108.2 },
    { name: "Sarah Nakato", role: "Export Coordinator", target: 750000, achieved: 685000, percentage: 91.3 },
    { name: "David Ochan", role: "Account Manager", target: 650000, achieved: 720000, percentage: 110.8 },
    { name: "Grace Nalongo", role: "Market Analyst", target: 500000, achieved: 485000, percentage: 97.0 }
  ];

  const monthlyMetrics = [
    { month: "January", sales: 980000, exports: 315, customers: 42 },
    { month: "February", sales: 1050000, exports: 298, customers: 38 },
    { month: "March", sales: 1170000, exports: 342, customers: 45 },
    { month: "April", sales: 1085000, exports: 325, customers: 41 },
    { month: "May", sales: 1240000, exports: 368, customers: 47 },
    { month: "June", sales: 1350000, exports: 385, customers: 52 }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'exceeded': return 'text-green-600';
      case 'on-track': return 'text-blue-600';
      case 'close': return 'text-yellow-600';
      case 'behind': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 90) return 'bg-blue-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Performance Tracking & Analytics</h3>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Performance Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sales Targets Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {salesTargets.map((target, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{target.metric}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${getStatusColor(target.status)}`}>
                    {target.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({target.achieved.toLocaleString()} / {target.target.toLocaleString()})
                  </span>
                </div>
              </div>
              <Progress value={Math.min(target.percentage, 100)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <span className={`font-bold ${
                    member.percentage >= 100 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {member.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>${member.achieved.toLocaleString()} / ${member.target.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(member.percentage, 100)} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyMetrics.slice(-3).map((month, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{month.month}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sales</p>
                    <p className="font-semibold text-green-600">
                      ${(month.sales / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exports</p>
                    <p className="font-semibold">{month.exports} tons</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Customers</p>
                    <p className="font-semibold">{month.customers}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Set Targets
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Trend Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Award className="h-6 w-6 mb-2" />
              Team Dashboard
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics Hub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTracking;
