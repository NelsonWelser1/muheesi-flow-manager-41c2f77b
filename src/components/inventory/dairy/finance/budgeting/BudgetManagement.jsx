import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const departments = [
  'Marketing',
  'Sales',
  'Operations',
  'Research & Development',
  'Human Resources',
  'IT',
  'Finance'
];

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    department: '',
    allocated: '',
    spent: '',
    fiscalYear: new Date().getFullYear()
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating new budget allocation:', newBudget);
    
    setBudgets([...budgets, { 
      ...newBudget, 
      id: Date.now(),
      allocated: parseFloat(newBudget.allocated),
      spent: parseFloat(newBudget.spent) || 0
    }]);
    
    setNewBudget({
      department: '',
      allocated: '',
      spent: '',
      fiscalYear: new Date().getFullYear()
    });
    
    toast({
      title: "Success",
      description: "Budget allocation created successfully",
    });
  };

  const calculateProgress = (spent, allocated) => {
    return (spent / allocated) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-red-500";
    if (progress >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newBudget.department}
                  onValueChange={(value) => setNewBudget({ ...newBudget, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocated">Allocated Budget (UGX)</Label>
                <Input
                  id="allocated"
                  type="number"
                  value={newBudget.allocated}
                  onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spent">Current Expenditure (UGX)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={newBudget.spent}
                  onChange={(e) => setNewBudget({ ...newBudget, spent: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalYear">Fiscal Year</Label>
                <Input
                  id="fiscalYear"
                  type="number"
                  value={newBudget.fiscalYear}
                  onChange={(e) => setNewBudget({ ...newBudget, fiscalYear: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">Create Budget Allocation</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Allocated Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const progress = calculateProgress(budget.spent, budget.allocated);
                const remaining = budget.allocated - budget.spent;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.department}</TableCell>
                    <TableCell>UGX {budget.allocated.toLocaleString()}</TableCell>
                    <TableCell>UGX {budget.spent.toLocaleString()}</TableCell>
                    <TableCell>UGX {remaining.toLocaleString()}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1">
                        <Progress
                          value={progress}
                          className={getProgressColor(progress)}
                        />
                        <span className="text-xs text-gray-500">{progress.toFixed(1)}% spent</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManagement;