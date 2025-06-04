
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, AlertTriangle, Plus } from 'lucide-react';

const CashFlowManagement = () => {
  const cashFlowData = [
    {
      category: "Operating Activities",
      amount: 485000,
      change: "+12.5%",
      items: [
        { name: "Customer Collections", amount: 680000, status: "positive" },
        { name: "Supplier Payments", amount: -195000, status: "negative" }
      ]
    },
    {
      category: "Investing Activities", 
      amount: -125000,
      change: "-8.3%",
      items: [
        { name: "Equipment Purchase", amount: -85000, status: "negative" },
        { name: "Asset Sales", amount: -40000, status: "negative" }
      ]
    },
    {
      category: "Financing Activities",
      amount: 75000,
      change: "+25.0%",
      items: [
        { name: "Loan Proceeds", amount: 100000, status: "positive" },
        { name: "Loan Repayments", amount: -25000, status: "negative" }
      ]
    }
  ];

  const upcomingCashFlow = [
    { date: "Next 7 days", inflow: 125000, outflow: 89000, net: 36000 },
    { date: "Next 30 days", inflow: 485000, outflow: 320000, net: 165000 },
    { date: "Next 90 days", inflow: 1250000, outflow: 950000, net: 300000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Cash Flow Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Cash Flow Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Period Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cashFlowData.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{category.category}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${category.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(category.amount).toLocaleString()}
                    </span>
                    <Badge variant={category.amount >= 0 ? "default" : "destructive"}>
                      {category.change}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className={item.status === 'positive' ? 'text-green-600' : 'text-red-600'}>
                        ${Math.abs(item.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingCashFlow.map((period, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{period.date}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Inflow</p>
                    <p className="font-semibold text-green-600">
                      +${period.inflow.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Outflow</p>
                    <p className="font-semibold text-red-600">
                      -${period.outflow.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net</p>
                    <p className={`font-semibold ${period.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${period.net.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Record Receipt
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Cash Forecast
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Set Alerts
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Payment Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowManagement;
