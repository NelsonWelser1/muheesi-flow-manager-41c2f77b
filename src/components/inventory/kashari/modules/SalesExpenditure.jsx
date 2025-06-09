
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";

const SalesExpenditure = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sales');

  const salesData = [
    { date: '2023-07-01', item: 'Milk Sales', amount: 450000, type: 'income' },
    { date: '2023-07-02', item: 'Banana Sales', amount: 280000, type: 'income' },
    { date: '2023-07-03', item: 'Feed Purchase', amount: -120000, type: 'expense' },
    { date: '2023-07-04', item: 'Veterinary Services', amount: -85000, type: 'expense' },
  ];

  const totalIncome = salesData
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = salesData
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales & Expenditure</h2>
        <Button onClick={() => toast({ title: "Feature Coming Soon", description: "Advanced analytics will be available soon" })}>
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              UGX {totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              UGX {totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              UGX {netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netProfit >= 0 ? '+' : '-'}{Math.abs(((netProfit / totalIncome) * 100)).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{transaction.item}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}UGX {Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesExpenditure;
