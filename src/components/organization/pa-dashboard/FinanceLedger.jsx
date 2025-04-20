import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const FinanceLedger = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic would go here
    console.log("Transaction submitted");
    setShowForm(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Ledger</CardTitle>
        <div className="flex justify-end">
          <Button 
            onClick={toggleForm}
            variant="default" 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Collapsible form section */}
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionType">Transaction Type</Label>
                    <Select id="transactionType" name="transactionType">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="transfer">Transfer</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input type="number" id="amount" name="amount" placeholder="Enter amount" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Enter transaction description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select id="category" name="category">
                    <option value="salary">Salary</option>
                    <option value="supplies">Supplies</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={toggleForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Transaction
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">
                View and manage your financial transactions.
              </p>
            </div>
            <div className="p-4">
              <div className="text-center text-muted-foreground py-10">
                No transactions recorded yet. Add your first transaction to get started.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceLedger;
