
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, X, Bug } from "lucide-react";
import { useFinanceAccountsData } from './finance-accounts/hooks/useFinanceAccountsData';
import TransactionForm from './finance-accounts/TransactionForm';
import TransactionTable from './finance-accounts/TransactionTable';
import FinanceSummary from './finance-accounts/FinanceSummary';

const FinanceAccounts = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    transactions,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchTransactions,
    debugForm,
    editingTransaction,
    setEditingTransaction,
    getFinanceSummary
  } = useFinanceAccountsData();

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    handleSubmit(data);
    if (!editingTransaction) {
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingTransaction(null);
    setShowForm(false);
  };

  const financeSummary = getFinanceSummary();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Finance & Accounts Management</CardTitle>
            <CardDescription>Manage income, expenses, and financial transactions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => debugForm()}
              className="flex items-center gap-1"
            >
              <Bug className="h-4 w-4" /> Debug
            </Button>
            <Button 
              onClick={() => {
                if (showForm && !editingTransaction) {
                  setShowForm(false);
                } else if (editingTransaction) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }} 
              className="flex items-center gap-2"
            >
              {showForm || editingTransaction ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm || editingTransaction ? 'Cancel' : 'Add Transaction'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <FinanceSummary summary={financeSummary} />
          </TabsContent>
          
          <TabsContent value="transactions">
            {/* Transaction Form */}
            {(showForm || editingTransaction) && (
              <div className="mb-6 p-4 border rounded-md bg-muted/50">
                <h3 className="text-lg font-medium mb-4">{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                <TransactionForm 
                  form={form} 
                  onSubmit={onSubmit}
                  isEdit={!!editingTransaction}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
            
            {/* Transaction Table */}
            <TransactionTable 
              transactions={transactions} 
              isLoading={isLoading} 
              handleEdit={(transaction) => {
                handleEdit(transaction);
                setShowForm(true);
              }} 
              handleDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinanceAccounts;
