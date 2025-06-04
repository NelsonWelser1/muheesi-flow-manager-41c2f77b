
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, AlertCircle, Plus } from 'lucide-react';

const BudgetPlanning = () => {
  const budgetCategories = [
    {
      category: "Operations",
      budgeted: 500000,
      actual: 485000,
      variance: -15000,
      percentUsed: 97,
      status: "on-track"
    },
    {
      category: "Marketing",
      budgeted: 150000,
      actual: 165000,
      variance: 15000,
      percentUsed: 110,
      status: "over-budget"
    },
    {
      category: "R&D",
      budgeted: 200000,
      actual: 175000,
      variance: -25000,
      percentUsed: 87.5,
      status: "under-budget"
    },
    {
      category: "Personnel",
      budgeted: 800000,
      actual: 790000,
      variance: -10000,
      percentUsed: 98.75,
      status: "on-track"
    },
    {
      category: "Infrastructure",
      budgeted: 120000,
      actual: 135000,
      variance: 15000,
      percentUsed: 112.5,
      status: "over-budget"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-green-500 text-white';
      case 'over-budget': return 'bg-red-500 text-white';
      case 'under-budget': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (percentUsed) => {
    if (percentUsed <= 85) return 'bg-blue-500';
    if (percentUsed <= 100) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Budget Planning & Tracking</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual (Current Period)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCategories.map((budget, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category}</span>
                  <Badge className={getStatusColor(budget.status)}>
                    {budget.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {budget.percentUsed.toFixed(1)}%</span>
                    <span>
                      ${budget.actual.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={Math.min(budget.percentUsed, 100)} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Variance: {budget.variance >= 0 ? '+' : ''}${budget.variance.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg">Total Budget</h4>
                <p className="text-2xl font-bold text-blue-600">$1.77M</p>
                <p className="text-sm text-muted-foreground">Current fiscal year</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg">Total Spent</h4>
                <p className="text-2xl font-bold text-green-600">$1.75M</p>
                <p className="text-sm text-muted-foreground">98.9% utilized</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Categories On Track</span>
                <span className="font-semibold">2/5</span>
              </div>
              <div className="flex justify-between">
                <span>Over Budget</span>
                <span className="font-semibold text-red-600">2/5</span>
              </div>
              <div className="flex justify-between">
                <span>Under Budget</span>
                <span className="font-semibold text-blue-600">1/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Calculator className="h-6 w-6 mb-2" />
              Budget Revision
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Forecast Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              Variance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              New Category
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanning;
