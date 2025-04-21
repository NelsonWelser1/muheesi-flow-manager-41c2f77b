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

  const totalIncome = ledger.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0);
  const totalExpenses = ledger.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAddTransactionClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAddTransaction = () => {
    setShowAddForm(false);
  };

  const handleSubmitAddTransaction = (form) => {
    setIsSubmitting(true);

    // Create new entry and add to the ledger
    const newEntry = {
      id: Date.now(),
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
    };
    // Ideally, submit to backend/db here
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
                <span className="text-2xl font-bold">UGX {netProfit.toLocaleString()}</span>
              </div>
              <div className="text-sm text-blue-500">
                <span>+10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Button & Inline Form */}
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
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>UGX {item.amount.toLocaleString()}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialLedger;
