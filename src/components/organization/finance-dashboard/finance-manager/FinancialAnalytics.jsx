
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const FinancialAnalytics = () => {
  const kpiMetrics = [
    { name: "Gross Profit Margin", value: "42.5%", trend: "+2.3%", status: "up" },
    { name: "Net Profit Margin", value: "18.7%", trend: "+1.1%", status: "up" },
    { name: "Current Ratio", value: "2.4", trend: "+0.2", status: "up" },
    { name: "Debt-to-Equity", value: "0.35", trend: "-0.05", status: "down" },
    { name: "ROA", value: "12.3%", trend: "+0.8%", status: "up" },
    { name: "ROE", value: "16.8%", trend: "+1.2%", status: "up" }
  ];

  const revenueByCategory = [
    { category: "Coffee Export", amount: 1650000, percentage: 68.2 },
    { category: "Dairy Products", amount: 485000, percentage: 20.1 },
    { category: "Fresh Produce", amount: 185000, percentage: 7.6 },
    { category: "Other", amount: 100000, percentage: 4.1 }
  ];

  const costAnalysis = [
    { category: "Raw Materials", amount: 850000, percentage: 42.5 },
    { category: "Labor", amount: 520000, percentage: 26.0 },
    { category: "Operations", amount: 320000, percentage: 16.0 },
    { category: "Marketing", amount: 180000, percentage: 9.0 },
    { category: "Administration", amount: 130000, percentage: 6.5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Analytics & KPIs</h3>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Advanced Analytics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {kpiMetrics.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <h4 className="font-semibold text-sm mb-2">{kpi.name}</h4>
                <p className="text-2xl font-bold mb-1">{kpi.value}</p>
                <p className={`text-xs flex items-center justify-center gap-1 ${
                  kpi.status === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${kpi.status === 'down' ? 'rotate-180' : ''}`} />
                  {kpi.trend}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueByCategory.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-semibold">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.percentage}% of total revenue
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {costAnalysis.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-semibold">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.percentage}% of total costs
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Trend Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <PieChart className="h-6 w-6 mb-2" />
              Ratio Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Performance Dashboard
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Custom Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAnalytics;
