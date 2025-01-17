import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BudgetAllocationForm = ({ 
  budgetCategories, 
  selectedCategory, 
  setSelectedCategory, 
  newBudget, 
  setNewBudget, 
  handleSubmit 
}) => {
  console.log('Rendering BudgetAllocationForm component');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Allocation Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setNewBudget({ ...newBudget, department: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(budgetCategories).map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Budget Item</Label>
              <Select
                value={newBudget.category}
                onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget item" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories[selectedCategory]?.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newBudget.startDate}
                onChange={(e) => setNewBudget({ ...newBudget, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekly">Weekly Budget (UGX)</Label>
              <Input
                id="weekly"
                type="number"
                value={newBudget.weekly}
                onChange={(e) => setNewBudget({ ...newBudget, weekly: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Budget (UGX)</Label>
              <Input
                id="monthly"
                type="number"
                value={newBudget.monthly}
                onChange={(e) => setNewBudget({ ...newBudget, monthly: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocated">Annual Budget (UGX)</Label>
              <Input
                id="allocated"
                type="number"
                value={newBudget.allocated}
                onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Create Budget Allocation</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetAllocationForm;