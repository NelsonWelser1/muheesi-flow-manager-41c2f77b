
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, ArrowUpDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const LoansRepayments = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Loans & Repayments</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 245.8M</div>
            <p className="text-xs text-muted-foreground">Across all farmers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Active Borrowers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+12 since last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              Repayment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Repayments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Farmer #{(100 + i).toString()}</div>
                    <Badge variant={i === 1 ? "destructive" : i === 2 ? "default" : "outline"}>
                      {i === 1 ? "Overdue" : i === 2 ? "Due Today" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Loan Amount: UGX {(Math.random() * 2 + 1).toFixed(1)}M</span>
                      <span>Due: Apr {15 + i}, 2025</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Repayment progress</span>
                        <span>{(i * 20 + 10)}%</span>
                      </div>
                      <Progress value={i * 20 + 10} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="text-sm font-medium mb-1">Average Loan Size</div>
                  <div className="text-lg font-bold">UGX 1.73M</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="text-sm font-medium mb-1">Average Term</div>
                  <div className="text-lg font-bold">8 months</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="text-sm font-medium mb-1">Default Rate</div>
                  <div className="text-lg font-bold">3.2%</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="text-sm font-medium mb-1">Interest Rate</div>
                  <div className="text-lg font-bold">12%</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Loan Purpose Distribution</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Farm Equipment</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seeds & Fertilizer</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Livestock</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Other</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoansRepayments;
