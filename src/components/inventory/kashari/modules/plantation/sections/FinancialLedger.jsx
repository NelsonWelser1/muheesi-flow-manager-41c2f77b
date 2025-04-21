
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Percent, ShoppingCart, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AddLedgerTransactionForm from "./AddLedgerTransactionForm";

const FinancialLedger = () => {
  const [ledger, setLedger] = useState([
    { id: 1, date: '2025-04-01', type: 'income', amount: 325000, description: 'Sale to Nakumatt Supermarket' },
    { id: 2, date: '2025-04-03', type: 'expense', amount: 175000, description: 'Fertilizer purchase' },
    { id: 3, date: '2025-04-07', type: 'income', amount: 260000, description: 'Sale to Fresh Foods Market' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const openingBalance = 0;
  const sortedLedger = [...ledger].sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentBalance = openingBalance;
  const ledgerRows = sortedLedger.map((item) => {
    if (item.type === "income") {
      currentBalance += item.amount;
    } else if (item.type === "expense") {
      currentBalance -= item.amount;
    }
    return {
      ...item,
      runningBalance: currentBalance,
    };
  });

  const totalIncome = ledger.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0);
  const totalExpenses = ledger.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0);
  const closingBalance = openingBalance + totalIncome - totalExpenses;

  const handleAddTransactionClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAddTransaction = () => {
    setShowAddForm(false);
  };

  const handleSubmitAddTransaction = (form) => {
    setIsSubmitting(true);

    const newEntry = {
      id: Date.now(),
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
    };
    setLedger((prev) => [newEntry, ...prev]);
    setIsSubmitting(false);
    setShowAddForm(false);

    toast({
      title: "Transaction Added",
      description: "The transaction was successfully added.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">UGX {totalIncome.toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-500">
                <Percent className="h-4 w-4 inline" />
                <span>+20%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">UGX {totalExpenses.toLocaleString()}</span>
              </div>
              <div className="text-sm text-red-500">
                <span>-5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">UGX {closingBalance.toLocaleString()}</span>
              </div>
              <div className="text-sm text-blue-500">
                <span>+10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        {!showAddForm && (
          <Button onClick={handleAddTransactionClick}>
            Add Transaction
          </Button>
        )}
      </div>
      {showAddForm && (
        <AddLedgerTransactionForm
          onSubmit={handleSubmitAddTransaction}
          onCancel={handleCancelAddTransaction}
          isSubmitting={isSubmitting}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="font-bold">Opening Balance</TableCell>
                <TableCell className="font-bold">UGX {openingBalance.toLocaleString()}</TableCell>
              </TableRow>
              {ledgerRows.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className={
                    item.type === "income"
                      ? "text-green-600"
                      : item.type === "expense"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-green-700">
                    {item.type === "income" ? `UGX ${item.amount.toLocaleString()}` : ""}
                  </TableCell>
                  <TableCell className="text-red-700">
                    {item.type === "expense" ? `UGX ${item.amount.toLocaleString()}` : ""}
                  </TableCell>
                  <TableCell className="font-bold">
                    UGX {item.runningBalance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-right">Total</TableCell>
                <TableCell className="font-bold text-green-700">UGX {totalIncome.toLocaleString()}</TableCell>
                <TableCell className="font-bold text-red-700">UGX {totalExpenses.toLocaleString()}</TableCell>
                <TableCell className="font-bold"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="font-bold">Closing Balance</TableCell>
                <TableCell className="font-bold">UGX {closingBalance.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialLedger;
