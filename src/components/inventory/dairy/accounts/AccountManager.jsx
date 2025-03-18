
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentReceiptForm from './forms/PaymentReceiptForm';
import PaymentsReceiptsRecords from './records/PaymentsReceiptsRecords';
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";

const AccountManager = () => {
  const [activeView, setActiveView] = useState('payments-receipts-form');
  const [activeTab, setActiveTab] = useState('payments-receipts');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dairy Accounts Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments-receipts">
            Payments & Receipts
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="reports">
            Financial Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments-receipts" className="mt-4">
          {activeView === 'payments-receipts-form' ? (
            <PaymentReceiptForm setActiveView={setActiveView} />
          ) : activeView === 'payments-receipts-records' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('payments-receipts-form')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Form
                </Button>
                <Button
                  onClick={() => setActiveView('payments-receipts-form')}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add New Record
                </Button>
              </div>
              <PaymentsReceiptsRecords setActiveView={setActiveView} />
            </div>
          ) : null}
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Invoice management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Expenses tracking functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Financial reporting functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountManager;
