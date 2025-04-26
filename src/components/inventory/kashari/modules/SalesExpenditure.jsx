
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Calendar, ArrowUp, ArrowDown, Wallet, Banknote } from "lucide-react";
import TransactionForm from "./plantation/TransactionForm";
import { formatCurrency } from "./plantation/utils/formatters";

const SalesExpenditure = () => {
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      date: "2025-04-01", 
      bankAccount: "Primary Account", 
      type: "income", 
      payee: "Nakumatt Supermarket", 
      reason: "Banana Sales (Ripe)", 
      amount: 325000 
    },
    { 
      id: 2, 
      date: "2025-04-03", 
      bankAccount: "Primary Account", 
      type: "income", 
      payee: "Carrefour Uganda", 
      reason: "Banana Sales (Green)", 
      amount: 375000 
    },
    { 
      id: 3, 
      date: "2025-04-05", 
      bankAccount: "Primary Account", 
      type: "expense", 
      payee: "Eng. Collins", 
      reason: "Plantation Irrigation Repair", 
      amount: 250000 
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { toast } = useToast();
  
  // Set the opening balance
  const openingBalance = 29699000; // UGX 29,699,000
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Calculate running balances and closing balance
  let runningBalance = openingBalance;
  const ledgerEntries = sortedTransactions.map(transaction => {
    if (transaction.type === "income") {
      runningBalance += transaction.amount;
    } else if (transaction.type === "expense") {
      runningBalance -= transaction.amount;
    }
    
    return {
      ...transaction,
      runningBalance
    };
  });
  
  const closingBalance = runningBalance;
  
  // Calculate summary metrics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netChange = totalIncome - totalExpenses;
  
  // Handle adding new transaction
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };
  
  // Handle editing existing transaction
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmitTransaction = (formData) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? { ...formData, id: t.id } : t
      ));
      
      toast({
        title: "Transaction Updated",
        description: "The transaction was successfully updated.",
      });
    } else {
      const newTransaction = {
        ...formData,
        id: Date.now(),
      };
      
      setTransactions([...transactions, newTransaction]);
      
      toast({
        title: "Transaction Added",
        description: "The transaction was successfully recorded.",
      });
    }
    
    setShowForm(false);
    setEditingTransaction(null);
  };
  
  // Handle canceling form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#6E59A5]">Sales & Expenditure Ledger</h1>
        {!showForm && (
          <Button 
            onClick={handleAddTransaction}
            className="bg-[#8B5CF6] hover:bg-[#7C4FF3] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        )}
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={handleSubmitTransaction}
          onCancel={handleCancelForm}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Opening Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(openingBalance)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Net Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {netChange >= 0 ? (
                <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`text-2xl font-bold ${netChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(Math.abs(netChange))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Closing Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Banknote className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold text-[#8B5CF6]">
                {formatCurrency(closingBalance)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Account</TableHead>
                  <TableHead className="font-semibold">Payee</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold text-right">Balance</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-blue-50 border-b border-blue-100">
                  <TableCell colSpan={6} className="font-bold">Opening Balance</TableCell>
                  <TableCell className="font-bold text-right">{formatCurrency(openingBalance)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                
                {ledgerEntries.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.bankAccount}</TableCell>
                    <TableCell>{transaction.payee}</TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        transaction.type === "income" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.type === "income" ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className={`font-medium ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="font-medium text-right">
                      {formatCurrency(transaction.runningBalance)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTransaction(transaction)}
                        className="h-8 w-8"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                <TableRow className="bg-purple-50 border-t border-purple-100">
                  <TableCell colSpan={5} className="font-bold">Totals</TableCell>
                  <TableCell className="font-bold">
                    <div className="text-green-600">+ {formatCurrency(totalIncome)}</div>
                    <div className="text-red-600">- {formatCurrency(totalExpenses)}</div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                
                <TableRow className="bg-purple-100">
                  <TableCell colSpan={6} className="font-bold">Closing Balance</TableCell>
                  <TableCell className="font-bold text-right text-[#8B5CF6]">
                    {formatCurrency(closingBalance)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesExpenditure;
