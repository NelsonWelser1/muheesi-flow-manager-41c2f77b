
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Plus, Calculator, Book, ArrowUp, ArrowDown } from "lucide-react";
import { useCurrencyFormatter } from "@/components/inventory/dairy/accounts/records/components/payroll/hooks/useCurrencyFormatter";
import LedgerSummary from './LedgerSummary';

const DairyLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [openingBalance, setOpeningBalance] = useState(29699000); // Starting with 29,699,000 as in the example
  const [closingBalance, setClosingBalance] = useState(openingBalance);
  const { formatCurrency } = useCurrencyFormatter();

  useEffect(() => {
    // Calculate closing balance whenever transactions change
    let balance = openingBalance;
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance += Number(transaction.amount);
      } else {
        balance -= Number(transaction.amount);
      }
    });
    setClosingBalance(balance);
  }, [transactions, openingBalance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !reason || !amount) return;

    const newTransaction = {
      id: Date.now(),
      date,
      type,
      reason,
      amount: Number(amount),
    };

    setTransactions([...transactions, newTransaction]);
    
    // Reset form
    setDate('');
    setReason('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Ledger Entry
            </CardTitle>
            <CardDescription>Record a new financial transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Description / Reason</Label>
                <Input 
                  id="reason" 
                  placeholder="e.g., Milk Sales, Equipment Purchase" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (UGX)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input 
                    id="amount" 
                    className="pl-10" 
                    placeholder="0" 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </CardFooter>
        </Card>
        
        {/* Balance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Balance Summary
            </CardTitle>
            <CardDescription>Current financial position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Opening Balance</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(openingBalance)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700">Closing Balance</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(closingBalance)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Income:</span>
                <span className="text-green-600 font-semibold flex items-center">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatCurrency(transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Expenses:</span>
                <span className="text-red-600 font-semibold flex items-center">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatCurrency(transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Net Change:</span>
                <span className={`font-semibold ${closingBalance >= openingBalance ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(closingBalance - openingBalance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No transactions recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Summary Card */}
      {transactions.length > 0 && (
        <LedgerSummary 
          transactions={transactions} 
          openingBalance={openingBalance} 
          closingBalance={closingBalance} 
        />
      )}
    </div>
  );
};

export default DairyLedger;
