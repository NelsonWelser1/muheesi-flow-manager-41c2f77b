import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const budgetCategories = {
  'OPERATIONAL COSTS': [
    'Milk Purchase', 'Water Pumping bill', 'Electricity Bill', 'Heating',
    'Packaging', 'Rent', 'Office administration', 'Communication',
    'Stationary', 'Post harvest losses', 'Meetings', 'Internet',
    'Management system', 'Additives'
  ],
  'FIXED EXPENSES': [
    'Rent', 'Detergents', 'Plant equipment maintenance', 'Lab equipment and chemicals',
    'Safety and compliance', 'Security', 'Motor vehicle repairs', 'Electrical repairs'
  ],
  'HUMAN RESOURCE': [
    'Salaries and wages', 'Staff welfare', 'Operational safety and health',
    'NSSF', 'Allowances', 'Accommodation', 'Personal Protective Equipment',
    'Training', 'Recruitment'
  ],
  'MARKETING': [
    'Advertising', 'Brocures', 'Distribution', 'Allowance', 'Lunch'
  ],
  'CAPITAL EXPENDITURE': [
    'New equipment', 'Office Equipment'
  ],
  'LEGAL AND COMPLIANCE': [
    'Taxes', 'Penalties', 'Audit fees', 'Legal fees', 'PAYE',
    'Withholding tax', 'Trademark registration', 'Filing legal documents',
    'VAT', 'Trading Licence', 'GDA', 'UNBS Certification'
  ],
  'RESEARCH AND RESOURCE MOB': []
};

const initialBudget2025 = {
  department: 'OPERATIONAL COSTS',
  category: 'Milk Purchase',
  allocated: 691200000,
  spent: 0,
  fiscalYear: 2025,
  startDate: '2025-01-15',
  monthly: 57600000,
  weekly: 14400000
};

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('OPERATIONAL COSTS');
  const [newBudget, setNewBudget] = useState({
    department: '',
    category: '',
    allocated: '',
    spent: '',
    fiscalYear: 2025,
    startDate: '2025-01-15',
    monthly: '',
    weekly: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with 2025 budget data
    if (budgets.length === 0) {
      setBudgets([initialBudget2025]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating new budget allocation:', newBudget);
    
    setBudgets([...budgets, { 
      ...newBudget, 
      id: Date.now(),
      allocated: parseFloat(newBudget.allocated),
      spent: parseFloat(newBudget.spent) || 0,
      monthly: parseFloat(newBudget.monthly) || 0,
      weekly: parseFloat(newBudget.weekly) || 0
    }]);
    
    setNewBudget({
      department: '',
      category: '',
      allocated: '',
      spent: '',
      fiscalYear: 2025,
      startDate: '2025-01-15',
      monthly: '',
      weekly: ''
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

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.keys(budgetCategories).map((category) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-lg font-semibold">
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Weekly (UGX)</TableHead>
                        <TableHead>Monthly (UGX)</TableHead>
                        <TableHead>Annual (UGX)</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budgets
                        .filter(budget => budget.department === category)
                        .map((budget) => {
                          const progress = calculateProgress(budget.spent, budget.allocated);
                          
                          return (
                            <TableRow key={budget.id || budget.category}>
                              <TableCell>{budget.category}</TableCell>
                              <TableCell>{budget.weekly?.toLocaleString()}</TableCell>
                              <TableCell>{budget.monthly?.toLocaleString()}</TableCell>
                              <TableCell>{budget.allocated?.toLocaleString()}</TableCell>
                              <TableCell className="w-[200px]">
                                <div className="space-y-1">
                                  <Progress
                                    value={progress}
                                    className={getProgressColor(progress)}
                                  />
                                  <span className="text-xs text-gray-500">
                                    {progress.toFixed(1)}% spent
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManagement;