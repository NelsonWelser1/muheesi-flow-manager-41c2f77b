
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, CircleDollarSign } from "lucide-react";

const FinanceSummary = ({ summary }) => {
  // Format amount with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Total Income</p>
                <h3 className="text-2xl font-bold mt-1">UGX {formatAmount(summary.income)}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1">UGX {formatAmount(summary.expense)}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Net Balance</p>
                <h3 className={`text-2xl font-bold mt-1 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  UGX {formatAmount(Math.abs(summary.balance))}
                  {summary.balance < 0 && ' (Deficit)'}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CircleDollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
          {Object.keys(summary.categoryTotals).length === 0 ? (
            <p className="text-muted-foreground">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(summary.categoryTotals).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="font-medium">{category}</div>
                  <div className={amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    UGX {formatAmount(Math.abs(amount))}
                    {amount < 0 && ' (Expense)'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceSummary;
