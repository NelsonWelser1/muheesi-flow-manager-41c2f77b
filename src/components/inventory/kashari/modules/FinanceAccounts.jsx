
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { Bug, Plus } from "lucide-react";
import { useFinanceAccountsData } from './finance-accounts/hooks/useFinanceAccountsData';
import TransactionsTable from './finance-accounts/components/TransactionsTable';

const TRANSACTION_TYPES = ["Income", "Expense", "Transfer"];
const CATEGORIES = ["Sales", "Purchases", "Salaries", "Utilities", "Equipment", "Other"];
const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Mobile Money", "Cheque"];

const FinanceAccounts = () => {
  const {
    transactions,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    debugForm
  } = useFinanceAccountsData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Transaction Type</Label>
                  <Select 
                    onValueChange={(value) => form.setValue('transaction_type', value)}
                    defaultValue={form.getValues('transaction_type')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue('category', value)}
                    defaultValue={form.getValues('category')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    {...form.register('amount')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select 
                    onValueChange={(value) => form.setValue('payment_method', value)}
                    defaultValue={form.getValues('payment_method')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_number">Reference Number</Label>
                  <Input
                    id="reference_number"
                    placeholder="Enter reference number"
                    {...form.register('reference_number')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={(value) => form.setValue('status', value)}
                    defaultValue={form.getValues('status') || 'Completed'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter transaction description"
                    {...form.register('description')}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => debugForm()}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" /> Debug Form
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Add Transaction"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable 
            transactions={transactions} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceAccounts;
