
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillsExpensesForm from '../components/inventory/dairy/accounts/forms/BillsExpensesForm';
import PaymentsReceiptsForm from '../components/inventory/dairy/accounts/forms/PaymentsReceiptsForm';
import PayrollPayslipsForm from '../components/inventory/dairy/accounts/forms/PayrollPayslipsForm';
import { Receipt, CreditCard, Users } from 'lucide-react';

const Accounts = () => {
  const [activeForm, setActiveForm] = useState(null);

  const renderForm = () => {
    if (activeForm === 'bills') {
      return <BillsExpensesForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'payments') {
      return <PaymentsReceiptsForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'payroll') {
      return <PayrollPayslipsForm onBack={() => setActiveForm(null)} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Accounts Management</h1>
      
      {!activeForm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('bills')}>
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-red-600" />
                Bills & Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Manage bills and track expenses</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('bills')}>Manage Bills</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payments')}>
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                Payments & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Record payments and generate receipts</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('payments')}>Manage Payments</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payroll')}>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Payroll & Payslips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">Process payroll and generate payslips</p>
              <Button className="mt-4 w-full" onClick={() => setActiveForm('payroll')}>Process Payroll</Button>
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
