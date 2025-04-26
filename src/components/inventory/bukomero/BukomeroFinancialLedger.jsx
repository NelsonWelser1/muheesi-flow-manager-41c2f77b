
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import FinancialLedger from "../../shared/FinancialLedger";
import { formatCurrency } from "../../../utils/formatters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Mock transactions - in a real app, these would come from a backend
const initialTransactions = [
  { 
    id: 1001, 
    date: "2025-04-03", 
    bankAccount: "Bukomero Operations", 
    type: "income", 
    payee: "Nakasero Supermarket", 
    reason: "Milk Sales (Daily)", 
    amount: 785000 
  },
  { 
    id: 1002, 
    date: "2025-04-04", 
    bankAccount: "Bukomero Operations", 
    type: "expense", 
    payee: "Veterinary Services", 
    reason: "Monthly Cattle Health Check", 
    amount: 450000 
  },
  { 
    id: 1003, 
    date: "2025-04-05", 
    bankAccount: "Bukomero Operations", 
    type: "income", 
    payee: "Lira Dairy Processing", 
    reason: "Bulk Milk Delivery", 
    amount: 1250000 
  }
];

const BukomeroFinancialLedger = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const openingBalance = 3140000;

  // Simulate syncing with Kyalima Farmers main ledger
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      
      // Simulate sync delay
      setTimeout(() => {
        setIsSyncing(false);
        toast({
          title: "Ledger Synchronized",
          description: "Financial data has been synced with Kyalima Farmers Limited",
        });
      }, 2000);
    }, 300000); // Every 5 minutes
    
    return () => clearInterval(syncInterval);
  }, []);

  const handleTransactionAdded = (newTransactions) => {
    setTransactions(newTransactions);
    setIsSyncing(true);
    
    // Simulate sync with parent company
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Transaction Synchronized",
        description: "New transaction has been synced with Kyalima Farmers Limited",
      });
    }, 1500);
  };

  // Calculate totals for display
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {isSyncing && (
        <Alert className="bg-blue-50 border border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Synchronizing Data</AlertTitle>
          <AlertDescription>
            Financial records are being synchronized with Kyalima Farmers Limited main ledger...
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4">
        <h1 className="text-xl font-bold">Bukomero Dairy Farm Financial Management</h1>
        <p className="text-sm text-gray-500">
          Data Entry Terminal - Managed by Kyalima Farmers Limited
        </p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-md">
            <span className="text-sm text-gray-600">Total Income:</span>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-md">
            <span className="text-sm text-gray-600">Total Expenses:</span>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <FinancialLedger 
            entityName="Bukomero Dairy Farm" 
            initialTransactions={transactions}
            openingBalance={openingBalance}
            onTransactionAdded={handleTransactionAdded}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroFinancialLedger;
