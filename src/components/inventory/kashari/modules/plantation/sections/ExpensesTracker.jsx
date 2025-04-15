
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpensesTracker = () => {
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receipt, setReceipt] = useState('');
  const [notes, setNotes] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  
  const expenseCategories = [
    { value: 'seeds', label: 'Seeds/Seedlings' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'pesticide', label: 'Pesticides/Herbicides' },
    { value: 'labor', label: 'Labor/Wages' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'transport', label: 'Transportation' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'credit', label: 'Credit' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      date,
      category,
      description,
      amount: parseFloat(amount),
      paymentMethod,
      receipt,
      notes,
      createdAt: new Date()
    };
    setExpenses([...expenses, newExpense]);
    
    // Reset form
    setDate(null);
    setCategory('');
    setDescription('');
    setAmount('');
    setPaymentMethod('cash');
    setReceipt('');
    setNotes('');
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (expense.category && expenseCategories.find(c => c.value === expense.category)?.label.toLowerCase().includes(search)) ||
      (expense.description && expense.description.toLowerCase().includes(search)) ||
      (expense.notes && expense.notes.toLowerCase().includes(search))
    );
  });

  // Calculate totals by category
  const expensesByCategory = {};
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });

  const sortedCategories = Object.keys(expensesByCategory).sort(
    (a, b) => expensesByCategory[b] - expensesByCategory[a]
  );

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="records">Expense Records</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of expense"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount (UGX)</label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="receipt" className="text-sm font-medium">Receipt Number</label>
                    <Input
                      id="receipt"
                      value={receipt}
                      onChange={(e) => setReceipt(e.target.value)}
                      placeholder="Optional receipt number"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes about the expense"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle>Expense Records</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {expenses.length === 0 
                    ? "No expenses added yet. Use the form to add expenses."
                    : "No matching expenses found. Try a different search term."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount (UGX)</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map(expense => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date ? format(expense.date, 'dd/MM/yyyy') : 'N/A'}</TableCell>
                          <TableCell>{expenseCategories.find(c => c.value === expense.category)?.label || 'N/A'}</TableCell>
                          <TableCell>{expense.description || 'N/A'}</TableCell>
                          <TableCell>{expense.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {paymentMethods.find(m => m.value === expense.paymentMethod)?.label || 'N/A'}
                          </TableCell>
                          <TableCell>{expense.receipt || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{expense.notes || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Expense Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium">Total Expenses:</span>
                    <span className="text-lg font-semibold">UGX {totalExpenses.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Expenses by Category</h4>
                    {sortedCategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No expenses recorded yet</p>
                    ) : (
                      sortedCategories.map(categoryKey => (
                        <div key={categoryKey} className="flex justify-between items-center py-1 border-b">
                          <span>{expenseCategories.find(c => c.value === categoryKey)?.label || categoryKey}</span>
                          <span>UGX {expensesByCategory[categoryKey].toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Expense Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total records:</span>
                      <span className="font-medium">{expenses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date range:</span>
                      <span className="font-medium">
                        {expenses.length > 0 
                          ? `${format(new Date(Math.min(...expenses.map(e => e.date ? e.date.getTime() : Date.now()))), 'dd/MM/yyyy')} - ${format(new Date(Math.max(...expenses.map(e => e.date ? e.date.getTime() : Date.now()))), 'dd/MM/yyyy')}`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Categories used:</span>
                      <span className="font-medium">{Object.keys(expensesByCategory).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average expense:</span>
                      <span className="font-medium">
                        {expenses.length > 0 
                          ? `UGX ${(totalExpenses / expenses.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpensesTracker;
