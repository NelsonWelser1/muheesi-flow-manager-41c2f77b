
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Handshake, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  FileText
} from 'lucide-react';

const LoansRepayments = ({ selectedEntity }) => {
  const loansData = [
    {
      id: 1,
      lender: 'Development Finance Bank',
      company: 'Grand Berna Dairies',
      purpose: 'Equipment Purchase & Expansion',
      originalAmount: 50000000,
      currentBalance: 32000000,
      monthlyPayment: 2500000,
      interestRate: 12.5,
      startDate: '2023-01-15',
      maturityDate: '2025-01-15',
      status: 'Active',
      nextPaymentDate: '2024-06-15'
    },
    {
      id: 2,
      lender: 'Agricultural Development Bank',
      company: 'KAJON Coffee Limited',
      purpose: 'Coffee Processing Equipment',
      originalAmount: 35000000,
      currentBalance: 18500000,
      monthlyPayment: 1800000,
      interestRate: 11.0,
      startDate: '2023-06-01',
      maturityDate: '2025-06-01',
      status: 'Active',
      nextPaymentDate: '2024-06-10'
    },
    {
      id: 3,
      lender: 'Rural Development Bank',
      company: 'Kyalima Farmers Limited',
      purpose: 'Farm Infrastructure Development',
      originalAmount: 25000000,
      currentBalance: 8500000,
      monthlyPayment: 1200000,
      interestRate: 10.5,
      startDate: '2022-12-01',
      maturityDate: '2024-12-01',
      status: 'Active',
      nextPaymentDate: '2024-06-05'
    },
    {
      id: 4,
      lender: 'Commercial Bank Uganda',
      company: 'Grand Berna Dairies',
      purpose: 'Working Capital Loan',
      originalAmount: 15000000,
      currentBalance: 0,
      monthlyPayment: 0,
      interestRate: 15.0,
      startDate: '2022-03-01',
      maturityDate: '2024-03-01',
      status: 'Paid Off',
      nextPaymentDate: null
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      company: 'Kyalima Farmers Limited',
      lender: 'Rural Development Bank',
      amount: 1200000,
      dueDate: '2024-06-05',
      status: 'Due Soon',
      priority: 'High'
    },
    {
      id: 2,
      company: 'KAJON Coffee Limited',
      lender: 'Agricultural Development Bank',
      amount: 1800000,
      dueDate: '2024-06-10',
      status: 'Scheduled',
      priority: 'Medium'
    },
    {
      id: 3,
      company: 'Grand Berna Dairies',
      lender: 'Development Finance Bank',
      amount: 2500000,
      dueDate: '2024-06-15',
      status: 'Scheduled',
      priority: 'Medium'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-primary';
      case 'Paid Off': return 'bg-success';
      case 'Overdue': return 'bg-destructive';
      case 'Due Soon': return 'bg-warning';
      case 'Scheduled': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-destructive';
      case 'Medium': return 'bg-warning';
      case 'Low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredLoans = loansData.filter(loan => {
    const matchesEntity = selectedEntity === 'all' || loan.company === selectedEntity;
    return matchesEntity;
  });

  const filteredPayments = upcomingPayments.filter(payment => {
    const matchesEntity = selectedEntity === 'all' || payment.company === selectedEntity;
    return matchesEntity;
  });

  const totalOutstanding = filteredLoans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalMonthlyPayments = filteredLoans
    .filter(loan => loan.status === 'Active')
    .reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const activeLoans = filteredLoans.filter(loan => loan.status === 'Active').length;
  const upcomingPaymentAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Loans & Repayment Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <Handshake className="h-4 w-4 mr-2" />
            Apply for Loan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalOutstanding)}</p>
            <p className="text-xs text-muted-foreground">Across all loans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalMonthlyPayments)}</p>
            <p className="text-xs text-muted-foreground">Total obligations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{activeLoans}</p>
            <p className="text-xs text-muted-foreground">Currently servicing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Due This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{formatCurrency(upcomingPaymentAmount)}</p>
            <p className="text-xs text-muted-foreground">Payment obligations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loans">Loan Portfolio</TabsTrigger>
          <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analysis</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loans" className="space-y-4">
          <div className="space-y-3">
            {filteredLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{loan.lender}</h4>
                        <Badge variant="outline">{loan.company}</Badge>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{loan.purpose}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Original Amount</p>
                          <p className="font-semibold">{formatCurrency(loan.originalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Balance</p>
                          <p className="font-semibold text-destructive">{formatCurrency(loan.currentBalance)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly Payment</p>
                          <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{loan.interestRate}% p.a.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Repayment Progress</span>
                          <span>{(((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100).toFixed(1)}% paid</span>
                        </div>
                        <Progress 
                          value={((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Start: {new Date(loan.startDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Maturity: {new Date(loan.maturityDate).toLocaleDateString()}
                        </span>
                        {loan.nextPaymentDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Next Payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {loan.status === 'Active' && (
                        <Button size="sm">
                          Make Payment
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                        payment.status === 'Due Soon' ? 'bg-warning' : 'bg-primary'
                      }`}></div>
                      <div>
                        <p className="font-medium">{payment.lender}</p>
                        <p className="text-sm text-muted-foreground">{payment.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(payment.priority)}>
                        {payment.priority}
                      </Badge>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Calendar Overview</CardTitle>
            </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Payment Calendar</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Debt Service Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-md">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Coverage Ratio Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Loan Portfolio Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Interest Rate</span>
                    <span className="font-bold">
                      {(filteredLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / filteredLoans.length).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Debt-to-Asset Ratio</span>
                    <span className="font-bold">24.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Loan Term</span>
                    <span className="font-bold">24 months</span>
                  </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Payment Performance</span>
                      <span className="font-bold text-success">98.5%</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Loan Summary by Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Grand Berna Dairies', 'KAJON Coffee Limited', 'Kyalima Farmers Limited'].map(company => {
                  const companyLoans = filteredLoans.filter(loan => loan.company === company);
                  const companyDebt = companyLoans.reduce((sum, loan) => sum + loan.currentBalance, 0);
                  const companyPayments = companyLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
                  
                  return (
                    <div key={company} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{company}</h4>
                        <Badge variant="outline">{companyLoans.length} loans</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Outstanding Debt</span>
                          <p className="font-bold text-destructive">{formatCurrency(companyDebt)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Payments</span>
                          <p className="font-bold text-primary">{formatCurrency(companyPayments)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '2024-05-15', company: 'Grand Berna Dairies', amount: 2500000, status: 'Completed' },
                  { date: '2024-05-10', company: 'KAJON Coffee Limited', amount: 1800000, status: 'Completed' },
                  { date: '2024-05-05', company: 'Kyalima Farmers Limited', amount: 1200000, status: 'Completed' },
                  { date: '2024-04-15', company: 'Grand Berna Dairies', amount: 2500000, status: 'Completed' }
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">{payment.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(payment.amount)}</p>
                      <Badge className="bg-success">
                        {payment.status}
                      </Badge>
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

export default LoansRepayments;
