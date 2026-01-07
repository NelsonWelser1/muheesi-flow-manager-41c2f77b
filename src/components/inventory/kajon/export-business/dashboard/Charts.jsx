import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { useCoffeeAnalytics } from '@/hooks/useCoffeeAnalytics';

const Charts = ({ data }) => {
  const { analytics, loading } = useCoffeeAnalytics();

  const chartData = data || analytics;

  const mockData = {
    sourcing: [
      { month: 'Jan', arabica: 4000, robusta: 2400 },
      { month: 'Feb', arabica: 3000, robusta: 1398 },
      { month: 'Mar', arabica: 2000, robusta: 9800 },
      { month: 'Apr', arabica: 2780, robusta: 3908 },
    ],
    financial: [
      { month: 'Jan', revenue: 4000, expenses: 2400 },
      { month: 'Feb', revenue: 3000, expenses: 1398 },
      { month: 'Mar', revenue: 2000, expenses: 9800 },
      { month: 'Apr', revenue: 2780, expenses: 3908 },
    ]
  };

  // Process analytics data for charts
  const sourcingData = chartData?.monthlyOverview?.length > 0 
    ? chartData.monthlyOverview.map(m => ({
        month: m.month,
        arabica: Math.round(m.totalQuantity * 0.6),
        robusta: Math.round(m.totalQuantity * 0.4)
      }))
    : mockData.sourcing;

  const financialData = chartData?.monthlyOverview?.length > 0
    ? chartData.monthlyOverview.map(m => ({
        month: m.month,
        revenue: m.totalRevenue,
        expenses: Math.round(m.totalRevenue * 0.7)
      }))
    : mockData.financial;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sourcing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sourcingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="arabica" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="robusta" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              <Bar dataKey="expenses" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
