
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import FinancialLedger from "../../shared/FinancialLedger";

// Mock transactions - in a real app, these would come from a backend
const initialDairyTransactions = [
  { 
    id: 101, 
    date: "2025-04-02", 
    bankAccount: "Kyalima Operational", 
    type: "income", 
    payee: "Bukomero Dairy Farm", 
    reason: "Milk Sales (April Batch)", 
    amount: 4250000 
  },
  { 
    id: 102, 
    date: "2025-04-05", 
    bankAccount: "Kyalima Operational", 
    type: "expense", 
    payee: "Farm Supply Ltd", 
    reason: "Feed Purchase for Dairy", 
    amount: 1850000 
  }
];

const initialFarmTransactions = [
  { 
    id: 201, 
    date: "2025-04-01", 
    bankAccount: "Kyalima Investment", 
    type: "income", 
    payee: "Organic Farms Co", 
    reason: "Crop Sales Q1", 
    amount: 7650000 
  },
  { 
    id: 202, 
    date: "2025-04-08", 
    bankAccount: "Kyalima Investment", 
    type: "expense", 
    payee: "AgriTech Services", 
    reason: "Farm Equipment Maintenance", 
    amount: 3250000 
  }
];

const KyalimaFinancialLedger = () => {
  const [dairyTransactions, setDairyTransactions] = useState(initialDairyTransactions);
  const [farmTransactions, setFarmTransactions] = useState(initialFarmTransactions);
  const [currentTab, setCurrentTab] = useState("dairy");
  const { toast } = useToast();

  // In a real app, this would fetch data from an API
  useEffect(() => {
    // Simulate loading data
    toast({
      title: "Financial Data Loaded",
      description: "Financial records have been loaded successfully.",
    });
  }, []);

  const handleDairyTransactionAdded = (newTransactions) => {
    setDairyTransactions(newTransactions);
    // In a real app, this would save to backend
  };

  const handleFarmTransactionAdded = (newTransactions) => {
    setFarmTransactions(newTransactions);
    // In a real app, this would save to backend
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dairy">Dairy Operations Ledger</TabsTrigger>
            <TabsTrigger value="farm">Farm Assets Ledger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dairy">
            <FinancialLedger 
              entityName="Kyalima Dairy Operations" 
              initialTransactions={dairyTransactions}
              openingBalance={15750000}
              onTransactionAdded={handleDairyTransactionAdded}
            />
          </TabsContent>
          
          <TabsContent value="farm">
            <FinancialLedger 
              entityName="Kyalima Farm Assets" 
              initialTransactions={farmTransactions}
              openingBalance={43250000}
              onTransactionAdded={handleFarmTransactionAdded}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KyalimaFinancialLedger;
