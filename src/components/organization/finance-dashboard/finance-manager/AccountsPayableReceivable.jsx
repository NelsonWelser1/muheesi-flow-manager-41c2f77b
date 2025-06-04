
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AccountsPayableReceivable = () => {
  const accountsReceivable = [
    { customer: "Global Coffee Co.", amount: 85000, daysOverdue: 0, status: "current" },
    { customer: "European Exports Ltd", amount: 45000, daysOverdue: 15, status: "overdue" },
    { customer: "Asian Trade Partners", amount: 120000, daysOverdue: 0, status: "current" },
    { customer: "Local Distributors", amount: 25000, daysOverdue: 45, status: "critical" },
    { customer: "Premium Buyers Inc", amount: 65000, daysOverdue: 7, status: "overdue" }
  ];

  const accountsPayable = [
    { vendor: "Farm Equipment Supply", amount: 35000, dueDate: "2024-06-15", status: "due-soon" },
    { vendor: "Logistics Partners", amount: 18000, dueDate: "2024-06-10", status: "overdue" },
    { vendor: "Processing Equipment", amount: 75000, dueDate: "2024-06-20", status: "current" },
    { vendor: "Utility Services", amount: 12000, dueDate: "2024-06-08", status: "overdue" },
    { vendor: "Insurance Provider", amount: 28000, dueDate: "2024-06-25", status: "current" }
  ];

  const getARStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-500 text-white';
      case 'overdue': return 'bg-yellow-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAPStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-500 text-white';
      case 'due-soon': return 'bg-yellow-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Accounts Payable & Receivable</h3>
        <div className="flex gap-2">
          <Button variant="outline">Generate AR Report</Button>
          <Button>Process Payments</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Accounts Receivable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">$340K</p>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">$70K</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">$25K</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {accountsReceivable.map((account, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{account.customer}</h4>
                    <Badge className={getARStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">${account.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground">
                      {account.daysOverdue > 0 ? `${account.daysOverdue} days overdue` : 'Current'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Accounts Payable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$168K</p>
                <p className="text-sm text-muted-foreground">Total Payable</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">$35K</p>
                <p className="text-sm text-muted-foreground">Due Soon</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">$30K</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {accountsPayable.map((account, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{account.vendor}</h4>
                    <Badge className={getAPStatusColor(account.status)}>
                      {account.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">${account.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground">Due: {account.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Send Reminders
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Process Payment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Payment Plan
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Aging Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPayableReceivable;
