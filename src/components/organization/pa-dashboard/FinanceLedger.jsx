
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Percent, ShoppingCart, Package, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import TransactionForm from '../../../components/inventory/kashari/modules/plantation/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { formatDate } from '@/utils/dateUtils';
import LedgerUpdates from './LedgerUpdates';

const FinanceLedger = ({ selectedEntity }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const {
    transactions,
    isLoading,
    isFetching,
    fetchTransactions,
    saveTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  // Calculate financial summaries from transactions
  const openingBalance = 0;
  const transactionsData = transactions || [];
  
  // Sort transactions by date
  const sortedTransactions = [...transactionsData].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate running balance
  let currentBalance = openingBalance;
  const ledgerRows = sortedTransactions.map((item) => {
    if (item.type === "income") {
      currentBalance += Number(item.amount);
    } else if (item.type === "expense") {
      currentBalance -= Number(item.amount);
    }
    return {
      ...item,
      runningBalance: currentBalance,
    };
  });

  const totalIncome = transactionsData
    .filter(item => item.type === 'income')
    .reduce((total, item) => total + Number(item.amount), 0);
    
  const totalExpenses = transactionsData
    .filter(item => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount), 0);
    
  const closingBalance = openingBalance + totalIncome - totalExpenses;

  const handleAddTransactionClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAddTransaction = () => {
    setShowAddForm(false);
  };

  const handleSubmitAddTransaction = async (formData) => {
    try {
      const success = await saveTransaction(formData);
      if (success) {
        setShowAddForm(false);
        toast({
          title: "Transaction Added",
          description: "The transaction was successfully added to the database.",
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction. Please try again.",
      });
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
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
        {!showAddForm ? (
          <Button onClick={handleAddTransactionClick} className="bg-[#8B5CF6] hover:bg-[#7C4FF3]">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        ) : null}
      </div>

      {/* Inline Transaction Form */}
      {showAddForm && (
        <div className="relative animate-fade-in mb-6">
          <Card className="border-t-4 border-[#8B5CF6]">
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600" 
              onClick={handleCancelAddTransaction}
            >
              <X className="h-5 w-5" />
            </Button>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg text-[#6E59A5]">Add New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm 
                onSubmit={handleSubmitAddTransaction}
                onCancel={handleCancelAddTransaction}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Financial Ledger</CardTitle>
        </CardHeader>
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
              
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : ledgerRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No transactions found. Add your first transaction to get started.
                  </TableCell>
                </TableRow>
              ) : (
                ledgerRows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell className={
                      item.type === "income"
                        ? "text-green-600"
                        : item.type === "expense"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell className="text-green-700">
                      {item.type === "income" ? `UGX ${Number(item.amount).toLocaleString()}` : ""}
                    </TableCell>
                    <TableCell className="text-red-700">
                      {item.type === "expense" ? `UGX ${Number(item.amount).toLocaleString()}` : ""}
                    </TableCell>
                    <TableCell className="font-bold">
                      UGX {item.runningBalance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
              
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

      {/* Add the new Ledger Updates component */}
      <LedgerUpdates />
    </div>
  );
};

export default FinanceLedger;
