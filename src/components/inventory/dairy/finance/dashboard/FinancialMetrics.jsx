import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

const mockData = {
  cashFlow: [
    { month: 'Jan', income: 65000, expenses: 45000 },
    { month: 'Feb', income: 59000, expenses: 40000 },
    { month: 'Mar', income: 80000, expenses: 70000 },
    { month: 'Apr', income: 81000, expenses: 75000 },
    { month: 'May', income: 56000, expenses: 48000 },
  ],
  kpis: [
    { title: 'Total Revenue', value: '$324,500', change: '+12.5%', icon: DollarSign },
    { title: 'Expenses', value: '$165,200', change: '-2.3%', icon: CreditCard },
    { title: 'Profit Margin', value: '28.5%', change: '+4.2%', icon: TrendingUp },
    { title: 'Pending Invoices', value: '$42,500', change: '-15.3%', icon: AlertCircle },
  ]
};

const FinancialMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockData.kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetrics;