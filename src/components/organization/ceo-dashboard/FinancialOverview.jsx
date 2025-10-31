
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart } from 'lucide-react';

const FinancialOverview = ({ selectedCompany }) => {
  const financialData = {
    revenue: [
      { company: 'Grand Berna Dairies', q1: 450000, q2: 520000, q3: 580000, growth: 12.5 },
      { company: 'KAJON Coffee Limited', q1: 380000, q2: 420000, q3: 510000, growth: 21.4 },
      { company: 'Kyalima Farmers Limited', q1: 280000, q2: 310000, q3: 350000, growth: 11.6 }
    ],
    profitability: {
      grossMargin: 42.5,
      netMargin: 18.5,
      ebitda: 25.8,
      roi: 15.2
    },
    cashFlow: {
      operating: 425000,
      investing: -150000,
      financing: -75000,
      net: 200000
    },
    budgetVsActual: [
      { category: 'Revenue', budget: 2200000, actual: 2400000, variance: 9.1 },
      { category: 'Operating Costs', budget: 1650000, actual: 1580000, variance: -4.2 },
      { category: 'Capital Expenditure', budget: 300000, actual: 280000, variance: -6.7 },
      { category: 'R&D Investment', budget: 150000, actual: 175000, variance: 16.7 }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Company */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue by Company
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.revenue.map((company, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{company.company}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{formatCurrency(company.q3)}</span>
                    <Badge variant={company.growth > 15 ? "default" : "secondary"}>
                      {company.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {company.growth}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div>Q1: {formatCurrency(company.q1)}</div>
                  <div>Q2: {formatCurrency(company.q2)}</div>
                  <div>Q3: {formatCurrency(company.q3)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profitability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Profitability Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">
                {financialData.profitability.grossMargin}%
              </div>
              <div className="text-sm text-muted-foreground">Gross Margin</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {financialData.profitability.netMargin}%
              </div>
              <div className="text-sm text-muted-foreground">Net Margin</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {financialData.profitability.ebitda}%
              </div>
              <div className="text-sm text-muted-foreground">EBITDA Margin</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {financialData.profitability.roi}%
              </div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Operating Cash Flow</span>
              <span className="font-semibold text-success">
                {formatCurrency(financialData.cashFlow.operating)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Investing Cash Flow</span>
              <span className="font-semibold text-destructive">
                {formatCurrency(financialData.cashFlow.investing)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Financing Cash Flow</span>
              <span className="font-semibold text-destructive">
                {formatCurrency(financialData.cashFlow.financing)}
              </span>
            </div>
            <hr />
            <div className="flex justify-between items-center font-bold">
              <span>Net Cash Flow</span>
              <span className="text-primary">
                {formatCurrency(financialData.cashFlow.net)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget vs Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialData.budgetVsActual.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <Badge variant={Math.abs(item.variance) < 5 ? "default" : item.variance > 0 ? "destructive" : "secondary"}>
                    {item.variance > 0 ? '+' : ''}{item.variance}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Budget: {formatCurrency(item.budget)}</div>
                  <div>Actual: {formatCurrency(item.actual)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
