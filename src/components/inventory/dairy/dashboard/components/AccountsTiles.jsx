
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, CreditCard, Users } from "lucide-react";

const AccountsTiles = ({ onSelectForm }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('bills')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Bills & Expenses</CardTitle>
          <Calculator className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track and manage company expenses and bills.
          </p>
          <Button 
            className="mt-4 w-full bg-red-600 hover:bg-red-700"
            onClick={() => onSelectForm('bills')}
          >
            Record Bills & Expenses
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('payments')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Payments & Receipts</CardTitle>
          <CreditCard className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track incoming and outgoing payments.
          </p>
          <Button 
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700"
            onClick={() => onSelectForm('payments')}
          >
            Manage Payments
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectForm('payroll')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Payroll & Payslips</CardTitle>
          <Users className="h-5 w-5 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage employee payroll and generate payslips.
          </p>
          <Button 
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => onSelectForm('payroll')}
          >
            Manage Payroll
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsTiles;
