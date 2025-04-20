import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import ExportButtons from '@/components/ui/data-export/ExportButtons';

const FinanceLedger = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    type: "income",
    category: "",
    amount: "",
    description: "",
    paymentMethod: "cash"
  });

  // Sample transaction data
  const transactions = [
    {
      id: 1,
      date: new Date(2025, 3, 15),
      type: "income",
      category: "Sales",
      amount: 1250000,
      description: "Coffee bean sales to Kampala Roasters",
      paymentMethod: "bank_transfer"
    },
    {
      id: 2,
      date: new Date(2025, 3, 14),
      type: "expense",
      category: "Supplies",
      amount: 450000,
      description: "Purchase of fertilizer",
      paymentMethod: "cash"
    },
    {
      id: 3,
      date: new Date(2025, 3, 10),
      type: "income",
      category: "Consulting",
      amount: 800000,
      description: "Agricultural consulting for Mbale Farms",
      paymentMethod: "mobile_money"
    },
    {
      id: 4,
      date: new Date(2025, 3, 8),
      type: "expense",
      category: "Equipment",
      amount: 2500000,
      description: "New coffee processing machine",
      paymentMethod: "bank_transfer"
    },
    {
      id: 5,
      date: new Date(2025, 3, 5),
      type: "expense",
      category: "Labor",
      amount: 650000,
      description: "Weekly wages for farm workers",
      paymentMethod: "cash"
    }
  ];

  // Filter transactions based on active tab and search query
  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "income" && transaction.type === "income") ||
                      (activeTab === "expense" && transaction.type === "expense");
    
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setNewTransaction(prev => ({ ...prev, date }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    console.log("New transaction:", newTransaction);
    // Here you would typically save the transaction to your database
    // and update the transactions list
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Ledger</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-date">Date</Label>
                  <DatePicker
                    id="transaction-date"
                    selected={newTransaction.date}
                    onSelect={handleDateChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select 
                    defaultValue={newTransaction.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction-category">Category</Label>
                  <Input 
                    id="transaction-category"
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Sales, Supplies, Equipment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction-amount">Amount (UGX)</Label>
                  <Input 
                    id="transaction-amount"
                    name="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction-payment-method">Payment Method</Label>
                  <Select 
                    defaultValue={newTransaction.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  >
                    <SelectTrigger id="transaction-payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transaction-description">Description</Label>
                  <Textarea 
                    id="transaction-description"
                    name="description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    placeholder="Enter transaction details"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Transaction</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <ExportButtons 
            data={filteredTransactions} 
            filename="financial_ledger" 
            type="Transactions"
          />
        </div>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transactions</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(transaction.date, 'dd MMM yyyy')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceLedger;
