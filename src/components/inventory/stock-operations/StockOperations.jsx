
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ReceiveNewStock from '../kajon/stock-operations/ReceiveNewStock';
import SellCurrentStock from './SellCurrentStock';
import RelocateStock from './RelocateStock';
import ReceivePartnerStock from './ReceivePartnerStock';
import CoffeeInventoryRecords from './records/CoffeeInventoryRecords';

const StockOperations = ({ isKazo = false }) => {
  const [showRecords, setShowRecords] = useState(false);
  const [activeTab, setActiveTab] = useState("receive-new");
  
  if (showRecords && activeTab === "receive-new") {
    return (
      <Card>
        <CardContent className="pt-6">
          <CoffeeInventoryRecords onBack={() => setShowRecords(false)} isKazo={isKazo} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs 
          defaultValue="receive-new" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
          value={activeTab}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="justify-start overflow-x-auto">
              <TabsTrigger value="receive-new">Receive New Stock</TabsTrigger>
              <TabsTrigger value="sell">Sell Current Stock</TabsTrigger>
              <TabsTrigger value="relocate">Relocate Stock</TabsTrigger>
              <TabsTrigger value="receive-partner">Receive Partner Stock</TabsTrigger>
            </TabsList>
            
            {activeTab === "receive-new" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowRecords(true)}
              >
                <Eye className="h-4 w-4" />
                View Records
              </Button>
            )}
          </div>

          <TabsContent value="receive-new">
            <ReceiveNewStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="sell">
            <SellCurrentStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="relocate">
            <RelocateStock isKazo={isKazo} />
          </TabsContent>

          <TabsContent value="receive-partner">
            <ReceivePartnerStock isKazo={isKazo} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockOperations;
