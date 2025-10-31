
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Download,
  FileText,
  Calculator,
  Calendar
} from 'lucide-react';

const FinanceLedger = ({ selectedEntity }) => {
  const [dateRange, setDateRange] = useState('month');
  
  const financialData = {
    'Grand Berna Dairies': {
      revenue: 8500000,
      expenses: 6200000,
      profit: 2300000,
      growth: 12.5,
      cashFlow: 'positive'
    },
    'KAJON Coffee Limited': {
      revenue: 3200000,
      expenses: 2400000,
      profit: 800000,
      growth: 8.7,
      cashFlow: 'positive'
    },
    'Kyalima Farmers Limited': {
      revenue: 2800000,
      expenses: 2200000,
      profit: 600000,
      growth: 6.2,
      cashFlow: 'positive'
    }
  };

  const transactions = [
    {
      id: 1,
      date: '2024-06-01',
      description: 'Dairy Products Sale - Export',
      company: 'Grand Berna Dairies',
      type: 'Income',
      amount: 450000,
      category: 'Sales Revenue',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-01',
      description: 'Coffee Export Payment',
      company: 'KAJON Coffee Limited',
      type: 'Income',
      amount: 320000,
      category: 'Export Revenue',
      status: 'Pending'
    },
    {
      id: 3,
      date: '2024-05-31',
      description: 'Equipment Maintenance',
      company: 'Grand Berna Dairies',
      type: 'Expense',
      amount: -85000,
      category: 'Operations',
      status: 'Completed'
    },
    {
      id: 4,
      date: '2024-05-30',
      description: 'Farm Supplies Purchase',
      company: 'Kyalima Farmers Limited',
      type: 'Expense',
      amount: -120000,
      category: 'Procurement',
      status: 'Completed'
    }
  ];

  const getEntityData = () => {
    if (selectedEntity === 'all') {
      const total = Object.values(financialData).reduce((acc, data) => ({
        revenue: acc.revenue + data.revenue,
        expenses: acc.expenses + data.expenses,
        profit: acc.profit + data.profit
      }), { revenue: 0, expenses: 0, profit: 0 });
      
      return {
        ...total,
        growth: 9.1, // Average growth
        cashFlow: 'positive'
      };
    }
    
    return financialData[selectedEntity] || financialData['Grand Berna Dairies'];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const entityData = getEntityData();
  const filteredTransactions = selectedEntity === 'all' 
    ? transactions 
    : transactions.filter(t => t.company === selectedEntity);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Ledger & Analysis</h3>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-success" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(entityData.revenue)}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{entityData.growth}% vs last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(entityData.expenses)}</p>
            <p className="text-xs text-primary">Operational costs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{formatCurrency(entityData.profit)}</p>
            <p className="text-xs text-muted-foreground">
              Margin: {((entityData.profit / entityData.revenue) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent" />
              Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">Positive</p>
            <p className="text-xs text-success">Healthy liquidity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
          <TabsTrigger value="budgets">Budgets & Forecasts</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{transaction.description}</span>
                        <Badge variant="outline">{transaction.category}</Badge>
                        <Badge className={transaction.type === 'Income' ? 'bg-success' : 'bg-destructive'}>
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{transaction.company}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Expense Distribution</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Revenue</span>
                  <span className="text-success font-bold">{formatCurrency(entityData.revenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Expenses</span>
                  <span className="text-destructive font-bold">{formatCurrency(entityData.expenses)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b bg-gray-50 px-2 rounded">
                  <span className="font-bold">Net Profit</span>
                  <span className="text-green-600 font-bold text-lg">{formatCurrency(entityData.profit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budgets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">5.2M UGX</p>
                <p className="text-xs text-green-600">85% utilized</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quarterly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">15.6M UGX</p>
                <p className="text-xs text-blue-600">Projected revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Annual Target</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">65M UGX</p>
                <p className="text-xs text-purple-600">22% achieved</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Monthly P&L Statement', date: 'June 2024', type: 'Financial' },
              { name: 'Cash Flow Report', date: 'Q2 2024', type: 'Liquidity' },
              { name: 'Budget vs Actual', date: 'May 2024', type: 'Analysis' },
              { name: 'Tax Preparation Summary', date: 'Q1 2024', type: 'Compliance' }
            ].map((report, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceLedger;
