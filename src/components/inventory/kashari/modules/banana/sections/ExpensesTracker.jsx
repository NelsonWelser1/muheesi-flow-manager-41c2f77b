
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

const INITIAL_EXPENSES = [
  { id: 1, category: "Fertilizer", amount: 450000, date: "2025-04-10", description: "NPK application for mature plants" },
  { id: 2, category: "Labor", amount: 250000, date: "2025-04-05", description: "Weekly field maintenance" },
  { id: 3, category: "Equipment", amount: 780000, date: "2025-03-28", description: "Irrigation pump repair" }
];

const ExpensesTracker = () => {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const newExpense = {
      id: Date.now(),
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description
    };

    setExpenses(prev => [newExpense, ...prev]);
    setShowForm(false);
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banana Plantation Expenses</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Expense"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="E.g., Fertilizer, Labor, Equipment"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (UGX)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount in Ugandan Shillings"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of expense"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button type="submit">Save Expense</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Expense Records</CardTitle>
            <div className="text-lg font-semibold">
              Total: UGX {totalExpenses.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Description</th>
                  <th className="text-right py-3 px-2">Amount (UGX)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{expense.date}</td>
                    <td className="py-3 px-2">{expense.category}</td>
                    <td className="py-3 px-2">{expense.description}</td>
                    <td className="py-3 px-2 text-right">{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No expenses recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTracker;
