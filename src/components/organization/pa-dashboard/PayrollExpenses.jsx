
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Receipt, DollarSign, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const PayrollExpenses = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payroll & Expenses</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">126</div>
            <p className="text-xs text-muted-foreground">Across all entities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Monthly Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 67.5M</div>
            <p className="text-xs text-muted-foreground">Next run: Apr 25, 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              Pending Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Total: UGX 8.2M</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Pay Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 1-30</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">Apr 25</div>
                    <div className="text-xs text-muted-foreground">Next Payroll Date</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">126</div>
                    <div className="text-xs text-muted-foreground">Employees</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">UGX 67.5M</div>
                    <div className="text-xs text-muted-foreground">Total Amount</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Payroll Breakdown by Entity</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Grand Berna Dairies', amount: 'UGX 32.2M', employees: 58 },
                      { name: 'KAJON Coffee Limited', amount: 'UGX 18.7M', employees: 35 },
                      { name: 'Fresheco Farming', amount: 'UGX 10.1M', employees: 22 },
                      { name: 'Bukomero Dairy Farm', amount: 'UGX 6.5M', employees: 11 }
                    ].map((entity, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{entity.name}</div>
                          <div className="text-sm text-muted-foreground">{entity.employees} employees</div>
                        </div>
                        <div className="font-medium">{entity.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-medium">EXP-2025-{i.toString().padStart(4, '0')}</div>
                      <div className="text-sm text-muted-foreground">
                        {i % 3 === 0 ? 'Travel Expenses' : i % 3 === 1 ? 'Office Supplies' : 'Utility Bills'} • 
                        {i % 4 === 0 ? ' Grand Berna Dairies' : i % 4 === 1 ? ' KAJON Coffee Limited' : i % 4 === 2 ? ' Bukomero Dairy Farm' : ' Fresheco Farming'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">UGX {(Math.random() * 1 + 0.2).toFixed(1)}M</div>
                      <Badge variant={i % 3 === 0 ? "outline" : "secondary"}>
                        {i % 3 === 0 ? "Pending" : "Approved"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">March {2025 - i} Payroll</div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                      <div>Processed: Mar {25 - i % 2}, {2025 - i}</div>
                      <div>Total: UGX {(65 + i * 2).toFixed(1)}M</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollExpenses;
