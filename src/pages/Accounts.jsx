
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, CreditCard, FileText, ClipboardList } from "lucide-react";
import BillsExpensesForm from '../components/inventory/dairy/accounts/forms/BillsExpensesForm';
import PaymentsReceiptsForm from '../components/inventory/dairy/accounts/forms/PaymentsReceiptsForm';
import PayrollPayslipsForm from '../components/inventory/dairy/accounts/forms/PayrollPayslipsForm';
import BillsExpensesRecords from '../components/inventory/dairy/accounts/records/BillsExpensesRecords';
import PaymentsReceiptsRecords from '../components/inventory/dairy/accounts/records/PaymentsReceiptsRecords';

const Accounts = () => {
  const [activeView, setActiveView] = useState(null);

  const renderView = () => {
    switch (activeView) {
      case 'bills-expenses-form':
        return <BillsExpensesForm onBack={() => setActiveView(null)} />;
      case 'payments-receipts-form':
        return <PaymentsReceiptsForm onBack={() => setActiveView(null)} setActiveView={setActiveView} />;
      case 'payroll-payslips-form':
        return <PayrollPayslipsForm onBack={() => setActiveView(null)} />;
      case 'bills-expenses-records':
        return <BillsExpensesRecords onBack={() => setActiveView(null)} />;
      case 'payments-receipts-records':
        return <PaymentsReceiptsRecords onBack={() => setActiveView(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Accounts Management</h1>
      
      {!activeView ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Bills & Expenses</CardTitle>
              <Receipt className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Record and manage bills and expenses.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setActiveView('bills-expenses-form')}
                >
                  Record Bill/Expense
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveView('bills-expenses-records')}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  View Records
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Payments & Receipts</CardTitle>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Record payments and generate receipts.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActiveView('payments-receipts-form')}
                >
                  Record Payment/Receipt
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveView('payments-receipts-records')}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  View Records
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Payroll & Payslips</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Manage payroll and generate payslips.
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setActiveView('payroll-payslips-form')}
              >
                Process Payroll
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        renderView()
      )}
    </div>
  );
};

export default Accounts;
