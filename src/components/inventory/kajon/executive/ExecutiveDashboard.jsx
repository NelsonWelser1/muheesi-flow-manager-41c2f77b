
import React from 'react';
import { Grid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import useCoffeeStockData from '@/hooks/useCoffeeStockData';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceMetrics from './PerformanceMetrics';
import QualityInsights from './QualityInsights';
import StrategicActions from './StrategicActions';
import StrategicOverview from './StrategicOverview';

// Utility function for class name merging (since 'cn' is not defined)
const combineClassNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const ExecutiveDashboard = () => {
  const { stockData, locationData, historicalData, isLoading, error } = useCoffeeStockData();

  // Sample data for executive insights
  const salesData = [
    { month: 'Jan', domestic: 42000, export: 68000 },
    { month: 'Feb', domestic: 38000, export: 72000 },
    { month: 'Mar', domestic: 45000, export: 78000 },
    { month: 'Apr', domestic: 50000, export: 82000 },
    { month: 'May', domestic: 55000, export: 92000 },
    { month: 'Jun', domestic: 60000, export: 98000 },
  ];

  const qualityTrends = [
    { month: 'Jan', arabica: 92, robusta: 88 },
    { month: 'Feb', arabica: 91, robusta: 89 },
    { month: 'Mar', arabica: 93, robusta: 90 },
    { month: 'Apr', arabica: 94, robusta: 89 },
    { month: 'May', arabica: 95, robusta: 91 },
    { month: 'Jun', arabica: 94, robusta: 92 },
  ];

  const strategicInsights = [
    {
      id: 1,
      title: "Market Expansion Opportunity",
      description: "Analysis shows 32% growth potential in European specialty coffee markets.",
      category: "market",
      priority: "high",
      impact: "Revenue increase of ~$450K annually"
    },
    {
      id: 2,
      title: "Quality Improvement Initiative",
      description: "Implementing stricter bean selection could increase premium grade output by 18%.",
      category: "production",
      priority: "medium",
      impact: "Margin improvement of 12% on premium exports"
    },
    {
      id: 3,
      title: "Logistics Optimization",
      description: "Consolidating shipping routes could reduce transportation costs by 22%.",
      category: "logistics",
      priority: "high",
      impact: "Cost reduction of $65K annually"
    }
  ];

  const renderPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800 hover:bg-red-200",
      medium: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      low: "bg-green-100 text-green-800 hover:bg-green-200"
    };
    
    return (
      <Badge className={combineClassNames(styles[priority], "rounded-full px-2 py-1 text-xs font-medium")}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const renderCategoryBadge = (category) => {
    const styles = {
      market: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      production: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      logistics: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      financial: "bg-gray-100 text-gray-800 hover:bg-gray-200"
    };
    
    return (
      <Badge className={combineClassNames(styles[category], "rounded-full px-2 py-1 text-xs font-medium")}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StrategicOverview />
        <PerformanceMetrics />
        <QualityInsights />
        <StrategicActions />
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Executive Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="domestic" name="Domestic Sales ($)" fill="#8b5a2b" />
                      <Bar dataKey="export" name="Export Sales ($)" fill="#d4a76a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Coffee Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={qualityTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="arabica" name="Arabica Quality Score" stroke="#8b5a2b" strokeWidth={2} />
                      <Line type="monotone" dataKey="robusta" name="Robusta Quality Score" stroke="#d4a76a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="domestic" name="Domestic Sales ($)" fill="#8b5a2b" />
                    <Bar dataKey="export" name="Export Sales ($)" fill="#d4a76a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Coffee Quality Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="arabica" name="Arabica Quality Score" stroke="#8b5a2b" strokeWidth={2} />
                    <Line type="monotone" dataKey="robusta" name="Robusta Quality Score" stroke="#d4a76a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Business Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicInsights.map(insight => (
                  <Card key={insight.id} className="bg-amber-50/50 border-amber-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-amber-900">{insight.title}</h3>
                          <p className="text-sm text-amber-800 mt-1">{insight.description}</p>
                          <p className="text-xs text-amber-700 mt-2 font-medium">{insight.impact}</p>
                        </div>
                        <div className="flex space-x-2">
                          {renderCategoryBadge(insight.category)}
                          {renderPriorityBadge(insight.priority)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
