
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, PieChart, DollarSign, Download, CalendarIcon, Plus, Search, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, subDays } from 'date-fns';
import { cn } from "@/lib/utils";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const FinanceAccounts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactionType, setTransactionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: '',
    description: '',
    category: '',
    paymentMethod: '',
    reference: '',
    notes: ''
  });
  
  // Mock transaction data
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX-001',
      date: subDays(new Date(), 2),
      amount: 2500000,
      type: 'income',
      category: 'Milk Sales',
      description: 'Bulk milk supply to processor',
      paymentMethod: 'bank_transfer',
      reference: 'INV-2023-089',
      status: 'completed'
    },
    {
      id: 'TRX-002',
      date: subDays(new Date(), 4),
      amount: 1800000,
      type: 'income',
      category: 'Banana Sales',
      description: 'Weekly market sales',
      paymentMethod: 'cash',
      reference: 'MKT-2023-042',
      status: 'completed'
    },
    {
      id: 'TRX-003',
      date: subDays(new Date(), 5),
      amount: 750000,
      type: 'expense',
      category: 'Farm Supplies',
      description: 'Purchase of feeds and supplements',
      paymentMethod: 'mobile_money',
      reference: 'SUP-2023-031',
      status: 'completed'
    },
    {
      id: 'TRX-004',
      date: subDays(new Date(), 7),
      amount: 1200000,
      type: 'expense',
      category: 'Salaries',
      description: 'Monthly staff payments',
      paymentMethod: 'bank_transfer',
      reference: 'PAY-2023-008',
      status: 'completed'
    },
    {
      id: 'TRX-005',
      date: subDays(new Date(), 10),
      amount: 3500000,
      type: 'income',
      category: 'Coffee Sales',
      description: 'Coffee beans export',
      paymentMethod: 'bank_transfer',
      reference: 'EXP-2023-012',
      status: 'completed'
    },
    {
      id: 'TRX-006',
      date: subDays(new Date(), 12),
      amount: 500000,
      type: 'expense',
      category: 'Utilities',
      description: 'Electricity and water bill',
      paymentMethod: 'mobile_money',
      reference: 'UTIL-2023-025',
      status: 'completed'
    }
  ]);
  
  // Filter transactions based on search term and transaction type
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = transactionType ? transaction.type === transactionType : true;
    
    return matchesSearch && matchesType;
  });
  
  // Income categories
  const incomeCategories = [
    'Milk Sales', 'Banana Sales', 'Coffee Sales', 'Livestock Sales', 
    'Farm Tours', 'Training Services', 'Other Income'
  ];
  
  // Expense categories
  const expenseCategories = [
    'Farm Supplies', 'Salaries', 'Utilities', 'Transport', 'Maintenance',
    'Veterinary Services', 'Fertilizers', 'Seeds', 'Scholarships', 'Other Expenses'
  ];
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netCashflow = totalIncome - totalExpenses;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Chart data
  const categoryData = [
    ...transactions
      .filter(t => t.type === 'income')
      .reduce((acc, transaction) => {
        const existingCategory = acc.find(item => item.name === transaction.category);
        if (existingCategory) {
          existingCategory.value += transaction.amount;
        } else {
          acc.push({ name: transaction.category, value: transaction.amount, type: 'income' });
        }
        return acc;
      }, []),
    ...transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const existingCategory = acc.find(item => item.name === transaction.category);
        if (existingCategory) {
          existingCategory.value += transaction.amount;
        } else {
          acc.push({ name: transaction.category, value: transaction.amount, type: 'expense' });
        }
        return acc;
      }, [])
  ];
  
  const monthlyData = [
    { name: 'Jan', income: 8500000, expenses: 5200000 },
    { name: 'Feb', income: 7800000, expenses: 4800000 },
    { name: 'Mar', income: 9200000, expenses: 5500000 },
    { name: 'Apr', income: 8100000, expenses: 5000000 },
    { name: 'May', income: 8700000, expenses: 5100000 },
    { name: 'Jun', income: 9500000, expenses: 5700000 },
  ];
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };
  
  // Handle form submission
  const handleSubmit = (type) => (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || !formData.description || !formData.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new transaction
    const newTransaction = {
      id: `TRX-${String(transactions.length + 1).padStart(3, '0')}`,
      date: formData.date,
      amount: parseFloat(formData.amount),
      type: type,
      category: formData.category,
      description: formData.description,
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      status: 'completed',
      notes: formData.notes
    };
    
    // Add to transactions
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Reset form
    setFormData({
      date: new Date(),
      amount: '',
      description: '',
      category: '',
      paymentMethod: '',
      reference: '',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Transaction Recorded",
      description: `${type === 'income' ? 'Income' : 'Expense'} transaction has been recorded successfully.`,
    });
    
    // Switch to transactions tab
    setActiveTab('transactions');
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance & Accounts</CardTitle>
        <CardDescription>
          Manage financial transactions, reports and accounting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="income">Record Income</TabsTrigger>
            <TabsTrigger value="expense">Record Expense</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Income</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Net Cashflow</p>
                      <p className="text-2xl font-bold">{formatCurrency(netCashflow)}</p>
                    </div>
                    <div className={`${netCashflow >= 0 ? 'bg-blue-100' : 'bg-amber-100'} p-3 rounded-full`}>
                      <DollarSign className={`h-6 w-6 ${netCashflow >= 0 ? 'text-blue-600' : 'text-amber-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={monthlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-UG').format(value)} />
                        <Legend />
                        <Bar dataKey="income" fill="#4CAF50" name="Income" />
                        <Bar dataKey="expenses" fill="#FF5722" name="Expenses" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expense Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData.filter(item => item.type === 'expense')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.filter(item => item.type === 'expense').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <span className={`capitalize ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('transactions')}>
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('income')}>
                  <Plus className="h-4 w-4 mr-1" /> Income
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('expense')}>
                  <Plus className="h-4 w-4 mr-1" /> Expense
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          <span className={`capitalize ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transactions
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Income</CardTitle>
                <CardDescription>Record new income transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit('income')} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Transaction Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={handleDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (UGX) *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter transaction description"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Income Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference/Invoice Number</Label>
                      <Input
                        id="reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        placeholder="Enter reference number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('transactions')}>
                      Cancel
                    </Button>
                    <Button type="submit">Record Income</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Expense</CardTitle>
                <CardDescription>Record new expense transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit('expense')} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Transaction Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={handleDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (UGX) *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter transaction description"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Expense Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reference">Receipt/Reference Number</Label>
                      <Input
                        id="reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        placeholder="Enter reference number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('transactions')}>
                      Cancel
                    </Button>
                    <Button type="submit">Record Expense</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Reports</CardTitle>
                <CardDescription>Generate and view financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                      <BarChart className="h-12 w-12 text-blue-500" />
                      <h3 className="text-lg font-medium">Income Statement</h3>
                      <p className="text-sm text-center text-muted-foreground">
                        View income and expenses for the selected period
                      </p>
                      <Button className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                      <PieChart className="h-12 w-12 text-purple-500" />
                      <h3 className="text-lg font-medium">Category Analysis</h3>
                      <p className="text-sm text-center text-muted-foreground">
                        Analyze spending by category
                      </p>
                      <Button className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                      <DollarSign className="h-12 w-12 text-green-500" />
                      <h3 className="text-lg font-medium">Cash Flow</h3>
                      <p className="text-sm text-center text-muted-foreground">
                        Track cash flow over time
                      </p>
                      <Button className="w-full">Generate</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Generated On</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Income Statement</TableCell>
                          <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                          <TableCell>Jan - Jun 2023</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Expense Analysis</TableCell>
                          <TableCell>{format(subDays(new Date(), 2), 'MMM d, yyyy')}</TableCell>
                          <TableCell>Q2 2023</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cash Flow Statement</TableCell>
                          <TableCell>{format(subDays(new Date(), 7), 'MMM d, yyyy')}</TableCell>
                          <TableCell>YTD 2023</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceAccounts;
