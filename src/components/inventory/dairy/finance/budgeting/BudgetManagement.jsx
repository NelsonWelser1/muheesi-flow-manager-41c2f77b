import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const departments = [
  { name: 'Marketing', allocated: 50000, spent: 35000 },
  { name: 'Operations', allocated: 75000, spent: 45000 },
  { name: 'R&D', allocated: 30000, spent: 20000 },
  { name: 'Procurement', allocated: 60000, spent: 40000 },
];

const BudgetManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departmental Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {departments.map((dept) => {
            const percentage = (dept.spent / dept.allocated) * 100;
            return (
              <div key={dept.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted-foreground">
                    ${dept.spent.toLocaleString()} / ${dept.allocated.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% of budget used
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManagement;