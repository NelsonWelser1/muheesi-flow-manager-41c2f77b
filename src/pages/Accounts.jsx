
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, CreditCard, FileText } from "lucide-react";
import BillsExpensesForm from '../components/inventory/dairy/accounts/forms/BillsExpensesForm';
import PaymentsReceiptsForm from '../components/inventory/dairy/accounts/forms/PaymentsReceiptsForm';
import PayrollPayslipsForm from '../components/inventory/dairy/accounts/forms/PayrollPayslipsForm';

const Accounts = () => {
  const [activeForm, setActiveForm] = useState(null);

  const renderForm = () => {
    switch (activeForm) {
      case 'bills-expenses':
        return <BillsExpensesForm onBack={() => setActiveForm(null)} />;
      case 'payments-receipts':
        return <PaymentsReceiptsForm onBack={() => setActiveForm(null)} />;
      case 'payroll-payslips':
        return <PayrollPayslipsForm onBack={() => setActiveForm(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Accounts Management</h1>
      
      {!activeForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('bills-expenses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Bills & Expenses</CardTitle>
              <Receipt className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record and manage bills and expenses.
              </p>
              <Button 
                className="mt-4 w-full bg-red-600 hover:bg-red-700"
                onClick={() => setActiveForm('bills-expenses')}
              >
                Record Bill/Expense
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payments-receipts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Payments & Receipts</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record payments and generate receipts.
              </p>
              <Button 
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setActiveForm('payments-receipts')}
              >
                Record Payment/Receipt
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payroll-payslips')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Payroll & Payslips</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage payroll and generate payslips.
              </p>
              <Button 
                className="mt-4 w-full bg-green-600 hover:bg-green-700"
                onClick={() => setActiveForm('payroll-payslips')}
              >
                Process Payroll
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default Accounts;
