import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle } from 'lucide-react';

const mockBudgets = [
  {
    id: 1,
    department: 'Marketing',
    allocated: 50000,
    spent: 35000,
    remaining: 15000,
    status: 'On Track',
  },
  {
    id: 2,
    department: 'Production',
    allocated: 80000,
    spent: 75000,
    remaining: 5000,
    status: 'Warning',
  },
  {
    id: 3,
    department: 'R&D',
    allocated: 30000,
    spent: 20000,
    remaining: 10000,
    status: 'On Track',
  },
];

const BudgetManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Budget Allocation</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="rd">R&D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Budget Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Add notes" />
              </div>
            </div>
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
                <TableHead>Allocated</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.department}</TableCell>
                  <TableCell>${budget.allocated.toLocaleString()}</TableCell>
                  <TableCell>${budget.spent.toLocaleString()}</TableCell>
                  <TableCell>${budget.remaining.toLocaleString()}</TableCell>
                  <TableCell className="w-[200px]">
                    <div className="space-y-1">
                      <Progress 
                        value={(budget.spent / budget.allocated) * 100} 
                        className={budget.status === 'Warning' ? 'bg-red-100' : ''}
                      />
                      <p className="text-xs text-gray-500">
                        {((budget.spent / budget.allocated) * 100).toFixed(1)}% used
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {budget.status === 'Warning' ? (
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {budget.status}
                      </div>
                    ) : (
                      <span className="text-green-600">{budget.status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManagement;