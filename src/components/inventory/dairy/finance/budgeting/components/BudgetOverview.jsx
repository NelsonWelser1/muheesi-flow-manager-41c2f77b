import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const BudgetOverview = ({ budgetCategories, budgets }) => {
  console.log('Rendering BudgetOverview component');

  const calculateProgress = (spent, allocated) => {
    return (spent / allocated) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-red-500";
    if (progress >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
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
  );
};

export default BudgetOverview;