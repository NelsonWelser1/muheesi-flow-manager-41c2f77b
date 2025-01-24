import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const KyalimaFarmersLimited = () => {
  const loanMetrics = {
    totalLoans: "UGX 150,000,000",
    activeLoans: "UGX 120,000,000",
    duePayments: "UGX 15,000,000",
    businessReturns: "UGX 45,000,000",
    loanProgress: 35
  };

  const loans = [
    {
      id: "L001",
      institution: "Microfinance Support Center",
      startDate: "2024-01-15",
      dueDate: "2025-01-15",
      amount: "UGX 100,000,000",
      remaining: "UGX 65,000,000",
      nextPayment: "2024-04-15",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kyalima" className="space-y-4">
            <TabsList>
              <TabsTrigger value="kyalima">Kyalima Operations</TabsTrigger>
              <TabsTrigger value="loan-manager">Loan Manager</TabsTrigger>
            </TabsList>

            <TabsContent value="kyalima">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Grain Stock</h3>
                <ul>
                  <li className="mb-1">Maize: 20,000 MT</li>
                  <li className="mb-1">Hulled white sesame: 2,000 MT</li>
                  <li className="mb-1">Soybean: 50,000 MT</li>
                  <li className="mb-1">Cocoa: 500 MT</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="loan-manager">
              <div className="space-y-6">
                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{loanMetrics.totalLoans}</div>
                      <p className="text-sm text-muted-foreground">Total Loans</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{loanMetrics.activeLoans}</div>
                      <p className="text-sm text-muted-foreground">Active Loans</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{loanMetrics.duePayments}</div>
                      <p className="text-sm text-muted-foreground">Due Payments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{loanMetrics.businessReturns}</div>
                      <p className="text-sm text-muted-foreground">Business Returns</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Loan Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Repayment Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={loanMetrics.loanProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {loanMetrics.loanProgress}% of total loans repaid
                    </p>
                  </CardContent>
                </Card>

                {/* Loans Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Loans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Loan ID</TableHead>
                          <TableHead>Institution</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Remaining</TableHead>
                          <TableHead>Next Payment</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell>{loan.id}</TableCell>
                            <TableCell>{loan.institution}</TableCell>
                            <TableCell>{loan.startDate}</TableCell>
                            <TableCell>{loan.dueDate}</TableCell>
                            <TableCell>{loan.amount}</TableCell>
                            <TableCell>{loan.remaining}</TableCell>
                            <TableCell>{loan.nextPayment}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                loan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                loan.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {loan.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;