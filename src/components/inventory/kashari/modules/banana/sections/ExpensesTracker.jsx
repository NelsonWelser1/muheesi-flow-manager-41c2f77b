
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for expenses - in a real app, this would come from a database
const mockExpenses = [
  { id: 1, date: '2025-01-15', category: 'seeds', description: 'Maize Seeds', amount: 450000, produce: 'maize' },
  { id: 2, date: '2025-01-20', category: 'fertilizer', description: 'NPK Fertilizer', amount: 800000, produce: 'coffee' },
  { id: 3, date: '2025-02-05', category: 'labor', description: 'Planting Labor', amount: 350000, produce: 'banana' },
  { id: 4, date: '2025-02-15', category: 'pesticides', description: 'Insecticides', amount: 230000, produce: 'beans' },
];

const ExpensesTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    produce: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new expense to our list
    const updatedExpenses = [...expenses, {
      id: Date.now(), // Simple ID generation
      date: newExpense.date,
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      produce: newExpense.produce
    }];
    
    setExpenses(updatedExpenses);
    
    // Reset form and hide it
    setNewExpense({
      date: '',
      category: '',
      description: '',
      amount: '',
      produce: ''
    });
    setShowForm(false);
  };
  
  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Plantation Expenses</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Expense'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input 
                  type="date" 
                  name="date" 
                  value={newExpense.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  name="category" 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seeds">Seeds</SelectItem>
                    <SelectItem value="fertilizer">Fertilizer</SelectItem>
                    <SelectItem value="pesticides">Pesticides</SelectItem>
                    <SelectItem value="tools">Tools & Equipment</SelectItem>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Related Produce</label>
                <Select 
                  name="produce" 
                  onValueChange={(value) => handleSelectChange('produce', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select produce type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                    <SelectItem value="general">General (All crops)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (UGX)</label>
                <Input 
                  type="number" 
                  name="amount" 
                  value={newExpense.amount} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input 
                  name="description" 
                  value={newExpense.description} 
                  onChange={handleInputChange} 
                  placeholder="Brief description..." 
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save Expense</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Produce</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No expenses recorded</TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell className="capitalize">{expense.produce}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesTracker;
